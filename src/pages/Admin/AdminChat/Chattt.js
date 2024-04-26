import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

function Chattt() {
    const { userId } = useParams();

    useEffect(() => {
        const socket = new SockJS('http://localhost:8080/chat-websocket');
        const client = Stomp.over(socket);

        client.connect({}, () => {
            client.subscribe(`/user/${userId}/queue/messages`, onMessageReceived);
        });

        return () => {
            client.disconnect();
        };
    }, []);

    function onMessageReceived(message) {
        console.log(message);
    }

    return <div>chat vl</div>;
}

export default Chattt;
