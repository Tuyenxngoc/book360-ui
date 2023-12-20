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
        customerId: 0,
        name: '',
        phonenumber: '',
        address: '',
        avatar: ''
    }
}

const AuthProvider = ({ children }) => {

    const [authState, setAuthState] = useState(defaultAuth);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        validateToken();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const validateToken = async () => {
        setLoading(true);
        try {
            const token = getItem(localStorageKeys.ACCESS_TOKEN);
            if (!token) {
                setAuthState(defaultAuth);
                setLoading(false);
                return;
            }
            const response = await getCurrentUserLogin();
            if (response.status === 200) {
                const { id, username, roleName, email, customerId, name, phonenumber, address, avatar } = response.data.data;
                setAuthState({
                    isAuthenticated: true,
                    user: {
                        id,
                        username,
                        roleName,
                        email
                    },
                    customer: {
                        customerId,
                        name,
                        phonenumber,
                        address,
                        avatar
                    },
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

    // Function to update customer information
    const updateCustomerInfo = async () => {
        try {
            const response = await getCurrentUserLogin();
            if (response.status === 200) {
                const { customerId, name, phonenumber, address, avatar } = response.data.data;
                setAuthState((prevState) => ({
                    ...prevState,
                    customer: {
                        customerId,
                        name,
                        phonenumber,
                        address,
                        avatar,
                    },
                }));
            }
        } catch (error) {
            console.error('Error updating customer information:', error);
        }
    };

    const login = ({ accessToken, refreshToken }) => {
        setItem(localStorageKeys.ACCESS_TOKEN, accessToken);
        setItem(localStorageKeys.REFRESH_TOKEN, refreshToken);
        validateToken();
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
        updateCustomerInfo,
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

