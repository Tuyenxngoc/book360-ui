import { useState, useEffect, useRef } from 'react';
import Stomp from 'stompjs';
import SockJS from 'sockjs-client';
import useAuth from '~/hooks/useAuth';
import { getChatRooms, getMessages, getSupportUser } from '~/services/chatService';

import Style from './Chat.module.scss';
import classNames from 'classnames/bind';

import ClearIcon from '@mui/icons-material/Clear';
import SendIcon from '@mui/icons-material/Send';

const cx = classNames.bind(Style);

function Chat({ onClose }) {
    const { customer } = useAuth();
    const [stompClient, setStompClient] = useState(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const contentRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const supportUserResponse = await getSupportUser();
                let supportUser = supportUserResponse.data.data;

                const chatRoomsResponse = await getChatRooms();
                let chatRooms = chatRoomsResponse.data.data;
                if (chatRooms) {
                    const chatRoom = chatRooms.find((room) => room.recipientName === supportUser);
                    if (chatRoom) {
                        const messagesResponse = await getMessages(chatRoom.chatRoomId);
                        setMessages(messagesResponse.data.data);
                    }
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
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

        // Cuộn nội dung xuống đầu dòng mới
        contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }

    const sendMessage = () => {
        if (message.trim()) {
            const chatMessage = {
                content: message,
                senderName: customer.username,
                recipientName: 'tuyenngoc',
            };
            stompClient.send('/app/chat', {}, JSON.stringify(chatMessage));
            setMessage('');
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    };

    const handleMessageChange = (event) => {
        setMessage(event.target.value);
    };

    return (
        <div className={cx('chatContent', 'wrapper')}>
            <div className={cx('header')}>
                <div>Chat trực tiếp tại Website</div>
                <div onClick={onClose}>
                    <ClearIcon />
                </div>
            </div>
            <div className={cx('content')} ref={contentRef}>
                {messages.map((msg, index) => (
                    <div
                        className={cx('message-block', { 'message-block--mine': msg.senderName === customer.username })}
                        key={index}
                    >
                        <div className={cx('message')}>{msg.content}</div>
                    </div>
                ))}
            </div>

            <div className={cx('chat-action')}>
                <input
                    value={message}
                    onChange={handleMessageChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Nhập nội dung..."
                />
                {message && <SendIcon onClick={sendMessage} color="primary" />}
            </div>
        </div>
    );
}

export default Chat;
