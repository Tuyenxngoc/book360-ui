import { useEffect } from 'react';
import { createContext, useState } from 'react';
import Loading from '~/components/Loading';
import { getCurrentUserLogin } from '~/services/apiRequest';
import localStorageKeys, { getItem, removeItem, setItem } from '~/services/localStorageService';

const AuthContext = createContext();

const DeFAULT_AUTH = {
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

    const [authState, setAuthState] = useState(DeFAULT_AUTH);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        validateToken();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const validateToken = async () => {
        try {
            const token = getItem(localStorageKeys.ACCESS_TOKEN);
            if (!token) {
                setAuthState(DeFAULT_AUTH);
                setLoading(false);
                return;
            }
            const response = await getCurrentUserLogin();
            if (response.status === 200) {
                const { id, username, roleName, email, customerId, name, phonenumber, address } = response.data.data;
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
                        address
                    },
                });
            } else {
                setAuthState(DeFAULT_AUTH);
            }
        } catch (error) {
            setAuthState(DeFAULT_AUTH);
        } finally {
            setLoading(false);
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
        setAuthState(DeFAULT_AUTH);
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

