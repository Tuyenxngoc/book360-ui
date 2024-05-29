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
    const contentRef = useRef(null);
    const [isError, setIsError] = useState(false);

    const [chatState, setChatState] = useState({
        support: '',
        message: '',
        messages: [],
        stompClient: null,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const supportUserResponse = await getSupportUser();
                const supportUser = supportUserResponse.data.data;

                if (supportUser && supportUser === customer.username) {
                    setIsError(true);
                    return;
                }

                setChatState((prevState) => ({ ...prevState, support: supportUser }));

                const chatRoomsResponse = await getChatRooms();
                const chatRooms = chatRoomsResponse.data.data || [];
                const chatRoom = chatRooms.find((room) => room.recipientName === supportUser);
                if (chatRoom) {
                    const messagesResponse = await getMessages(chatRoom.chatRoomId);
                    setChatState((prevState) => ({ ...prevState, messages: messagesResponse.data.data }));
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const socket = new SockJS('http://localhost:8080/chat');
        const client = Stomp.over(socket);

        client.connect({}, () => {
            client.subscribe(`/user/${customer.username}/queue/messages`, onMessageReceived);
        });

        setChatState((prevState) => ({ ...prevState, stompClient: client }));

        return () => {
            client.disconnect();
        };
    }, [customer.username]);

    const onMessageReceived = (message) => {
        const receivedMessage = JSON.parse(message.body);
        setChatState((prevState) => ({ ...prevState, messages: [...prevState.messages, receivedMessage] }));
        contentRef.current.scrollTop = contentRef.current.scrollHeight;
    };

    const sendMessage = () => {
        const { message, stompClient } = chatState;
        if (message.trim() && stompClient) {
            const chatMessage = {
                content: message,
                senderName: customer.username,
                recipientName: chatState.support,
                roomName: customer.username,
            };
            stompClient.send('/app/chat', {}, JSON.stringify(chatMessage));
            setChatState((prevState) => ({ ...prevState, message: '' }));
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    };

    const handleMessageChange = (event) => {
        setChatState((prevState) => ({ ...prevState, message: event.target.value }));
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
                {chatState.messages.map((msg, index) => (
                    <div
                        className={cx('message-block', { 'message-block--mine': msg.senderName === customer.username })}
                        key={index}
                    >
                        <div className={cx('message')}>{msg.content}</div>
                    </div>
                ))}
                {isError && (
                    <div>
                        <p>Hiện chưa tìm được người hỗ trợ</p>
                    </div>
                )}
            </div>

            <div className={cx('chat-action')}>
                <input
                    value={chatState.message}
                    onChange={handleMessageChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Nhập nội dung..."
                />
                {chatState.message && !isError && <SendIcon onClick={sendMessage} color="primary" />}
            </div>
        </div>
    );
}

export default Chat;
