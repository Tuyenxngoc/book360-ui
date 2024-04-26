import { useState, useEffect } from 'react';
import { Button, TextField } from '@mui/material';
import Stomp from 'stompjs';
import SockJS from 'sockjs-client';
import useAuth from '~/hooks/useAuth';
import { getMessages } from '~/services/chatService';

function Chat() {
    const { customer } = useAuth();
    const [stompClient, setStompClient] = useState(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        getMessages()
            .then((response) => {
                setMessages(response.data.data)
            })
            .catch((error) => {
                console.log(error);
            })
    }, []);

    useEffect(() => {
        const socket = new SockJS('http://localhost:8080/chat-websocket');
        const client = Stomp.over(socket);

        client.connect({}, () => {
            client.subscribe(`/user/${customer.username}/queue/messages`, onMessageReceived);
        });

        setStompClient(client);

        return () => {
            client.disconnect();
        };
    }, []);

    function onMessageReceived(message) {
        const receivedMessage = JSON.parse(message.body);
        setMessages((prevMessages) => [...prevMessages, receivedMessage]);
    }

    const sendMessage = () => {
        if (message.trim()) {
            const chatMessage = {
                content: message,
                senderName: customer.username,
            };
            stompClient.send('/app/chat', {}, JSON.stringify(chatMessage));
            setMessage('');
        }
    };

    const handleMessageChange = (event) => {
        setMessage(event.target.value);
    };

    return (
        <div>
            {messages.map((msg, index) => (
                <div key={index}>{msg.content}</div>
            ))}
            <TextField
                value={message}
                onChange={handleMessageChange}
            />
            <Button onClick={sendMessage} disabled={!message.trim()}>send</Button>
        </div>
    );
};

export default Chat;