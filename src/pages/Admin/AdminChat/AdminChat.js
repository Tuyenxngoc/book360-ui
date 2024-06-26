import EmojiPicker from 'emoji-picker-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { getUserSendMessages } from '~/services/chatService';

function AdminChat() {
    const [listUser, setListUser] = useState([]);

    useEffect(() => {
        getUserSendMessages()
            .then((response) => {
                setListUser(response.data.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-4">
                    {listUser.map((user, i) => (
                        <Link key={i} to={user.fullName}>
                            {user.fullName}
                        </Link>
                    ))}
                </div>
                <div className="col-8"></div>
            </div>
        </div>
    );
}

export default AdminChat;
