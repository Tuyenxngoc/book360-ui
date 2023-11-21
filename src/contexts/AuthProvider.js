import { createContext, useState, useEffect } from 'react';
import { getCurrentUserLogin } from '~/services/apiRequest';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const defaultUser = { id: '', user: '', email: '', role: '', accessToken: '' };
    const [currentUser, setCurrentUser] = useState(defaultUser);

    useEffect(() => {
        const validateToken = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                if (!token) {
                    return;
                }
                // Gửi token đến máy chủ để xác minh tính hợp lệ
                const response = await getCurrentUserLogin(token);
                if (response.status === 200) {
                    const data = response.data.data;
                    setCurrentUser(
                        {
                            id: data.id,
                            user: data.username,
                            email: data.email,
                            role: data.roleName,
                            accessToken: token
                        }
                    )
                }
            } catch (error) {
                localStorage.removeItem('accessToken');
                setCurrentUser(defaultUser);
            }
        };
        validateToken();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const login = (user) => {
        setCurrentUser({
            ...defaultUser,
            ...user
        });
    };

    const logout = () => {
        setCurrentUser(defaultUser);
    };

    return (
        <AuthContext.Provider value={{ currentUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
};

export { AuthContext, AuthProvider };

