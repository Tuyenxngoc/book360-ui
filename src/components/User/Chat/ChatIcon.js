import { useEffect, useState } from 'react';

import Style from './Chat.module.scss';
import classNames from 'classnames/bind';
import Chat from './Chat';
import ForumIcon from '@mui/icons-material/Forum';

const cx = classNames.bind(Style);

function ChatIcon() {
    const [showChat, setShowChat] = useState(false);

    const handleToggleChat = () => {
        setShowChat(!showChat);
    };

    return showChat ? (
        <div>
            <Chat onClose={handleToggleChat} />
        </div>
    ) : (
        <div className={cx('chatIcon', 'wrapper')} onClick={handleToggleChat}>
            <ForumIcon fontSize="small" />
            <span className="mr-5">Chat với nhân viên tư vấn</span>
        </div>
    );
}

export default ChatIcon;
