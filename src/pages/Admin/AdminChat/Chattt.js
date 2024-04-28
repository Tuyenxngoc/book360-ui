import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import useAuth from '~/hooks/useAuth';

function Chattt() {
    const { userId } = useParams();
    const { customer } = useAuth();
    const [stompClient, setStompClient] = useState(null);

    useEffect(() => {
        const socket = new SockJS('http://localhost:8080/chat-websocket');
        const client = Stomp.over(socket);

        client.connect({}, () => {
            client.subscribe(`/user/bach/queue/messages`, onMessageReceived);
        });

        setStompClient(client);

        return () => {
            client.disconnect();
        };
    }, []);

    function onMessageReceived(message) {
        console.log(message);
    }

    function handleSendMessage() {
        const chatMessage = {
            content: 'message',
            senderName: 'tuyenngoc2',
            recipientName: 'bach2',
        };
        stompClient.send('/app/chat', {}, JSON.stringify(chatMessage));
    }

    return (
        <div>
            <div>chat vl</div>
            <button onClick={handleSendMessage}>send</button>
        </div>
    );
}

export default Chattt;
