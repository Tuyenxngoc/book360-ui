import { useEffect } from 'react';
import { createContext, useState } from 'react';
import Loading from '~/components/Loading';
import { getCurrentUserLogin } from '~/services/apiRequest';
import localStorageKeys, { getItem, removeItem, setItem } from '~/services/localStorageService';

const AuthContext = createContext();

const defaultAuth = {
    isAuthenticated: false,
    user: {
        id: '',
        username: '',
        roleName: '',
        email: ''
    },
    customer: {
        id: -1,
        name: '',
        phonenumber: '',
        address: ''
    }
}

const AuthProvider = ({ children }) => {

    const [authState, setAuthState] = useState(defaultAuth);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const validateToken = async () => {
            try {
                const token = getItem(localStorageKeys.ACCESS_TOKEN);
                if (!token) {
                    setAuthState(defaultAuth);
                    setLoading(false);
                    return;
                }
                const response = await getCurrentUserLogin();
                if (response.status === 200) {
                    const { id, customer, username, roleName, email } = response.data.data;
                    setAuthState({
                        isAuthenticated: true,
                        user: {
                            id,
                            username,
                            roleName,
                            email
                        },
                        customer: {
                            id: customer.id,
                            name: customer.name,
                            phonenumber: customer.phonenumber,
                            address: customer.address
                        }
                    });
                } else {
                    setAuthState(defaultAuth);
                }
            } catch (error) {
                setAuthState(defaultAuth);
            } finally {
                setLoading(false);
            }
        };
        validateToken();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const login = ({ id, username, roleName, accessToken, refreshToken }) => {
        setItem(localStorageKeys.ACCESS_TOKEN, accessToken);
        setItem(localStorageKeys.REFRESH_TOKEN, refreshToken);
        setAuthState({
            ...authState,
            isAuthenticated: true,
            user: {
                id,
                username,
                roleName,
            },
        });
    };

    const logout = () => {
        removeItem(localStorageKeys.ACCESS_TOKEN);
        removeItem(localStorageKeys.REFRESH_TOKEN);
        setAuthState(defaultAuth);
    };

    const contextValues = {
        isAuthenticated: authState.isAuthenticated,
        user: authState.user,
        customer: authState.customer,
        login,
        logout,
    };

    if (loading) {
        return <Loading />
    }

    return (
        <AuthContext.Provider value={contextValues}>
            {children}
        </AuthContext.Provider>
    )
};

export { AuthContext, AuthProvider };

