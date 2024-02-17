import PropTypes from 'prop-types';

import { useEffect } from 'react';
import { createContext, useState } from 'react';
import { toast } from 'react-toastify';
import Loading from '~/components/Loading';
import { logoutToken } from '~/services/authService';
import localStorageKeys, { getItem, removeItem, setItem } from '~/services/localStorageService';
import { getCurrentUserLogin } from '~/services/userService';

const AuthContext = createContext();

const defaultAuth = {
    isAuthenticated: false,
    customer: {
        username: '',
        fullName: '',
        roleName: '',
        email: '',
        phoneNumber: '',
        avatar: '',
        gender: '',
        dob: ''
    }
}

const AuthProvider = ({ children }) => {

    const [authData, setAuthData] = useState(defaultAuth);
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
                setAuthData(defaultAuth);
                setLoading(false);
                return;
            }
            const response = await getCurrentUserLogin();
            if (response.status === 200) {
                const {
                    username,
                    fullName,
                    roleName,
                    email,
                    phoneNumber,
                    avatar,
                    gender,
                    dob
                } = response.data.data;
                setAuthData({
                    isAuthenticated: true,
                    customer: {
                        username,
                        fullName,
                        roleName,
                        email,
                        phoneNumber,
                        avatar,
                        gender,
                        dob
                    },
                });
            } else {
                setAuthData(defaultAuth);
            }
        } catch (error) {
            setAuthData(defaultAuth);
        } finally {
            setLoading(false);
        }
    };

    const updateCustomerInfo = () => {
        validateToken();
    };

    const login = ({ accessToken, refreshToken }) => {
        setItem(localStorageKeys.ACCESS_TOKEN, accessToken);
        setItem(localStorageKeys.REFRESH_TOKEN, refreshToken);
        validateToken();
    };

    const logout = async () => {
        try {
            await logoutToken();
            removeItem(localStorageKeys.ACCESS_TOKEN);
            removeItem(localStorageKeys.REFRESH_TOKEN);
            setAuthData(defaultAuth);
        } catch (error) {
            toast.error('Có lỗi xảy ra trong quá trình đăng xuất');
        }
    };

    const contextValues = {
        isAuthenticated: authData.isAuthenticated,
        customer: authData.customer,
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

AuthProvider.propTypes = {
    children: PropTypes.node,
};

export { AuthContext, AuthProvider };

