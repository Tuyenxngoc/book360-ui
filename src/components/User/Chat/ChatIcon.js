import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Style from './Chat.module.scss';
import classNames from 'classnames/bind';

import Chat from './Chat';
import ForumIcon from '@mui/icons-material/Forum';
import useAuth from '~/hooks/useAuth';

const cx = classNames.bind(Style);

function ChatIcon() {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [showChat, setShowChat] = useState(false);

    const handleToggleChat = () => {
        if (isAuthenticated) {
            setShowChat(!showChat);
        } else {
            navigate('/login', { replace: true });
        }
    };

    useEffect(() => {
        if (!isAuthenticated) {
            setShowChat(false);
        }
    }, [isAuthenticated]);

    return showChat ? (
        <Chat onClose={handleToggleChat} />
    ) : (
        <div className={cx('chatIcon', 'wrapper')} onClick={handleToggleChat}>
            <ForumIcon fontSize="small" />
            <span className="mr-5">Chat với nhân viên tư vấn</span>
        </div>
    );
}

export default ChatIcon;
