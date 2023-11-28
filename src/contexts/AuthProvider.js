import { useEffect } from 'react';
import { createContext, useState } from 'react';
import Loading from '~/components/Loading';
import { getCurrentUserLogin } from '~/services/apiRequest';
import { getToken, removeToken, setRefreshToken, setToken } from '~/services/authService';

// Create a context for the authentication state
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const defaultAuth = {
        isAuthenticated: false,
        user: {
            id: '',
            customerId: '',
            username: '',
            role: '',
            email: ''
        },
    }

    // State to manage authentication status and user information
    const [authState, setAuthState] = useState(defaultAuth);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const validateToken = async () => {
            try {
                const token = getToken();
                if (!token) {
                    setAuthState(defaultAuth);
                    setLoading(false);
                    return;
                }
                const response = await getCurrentUserLogin();
                if (response.status === 200) {
                    const { id, customerId, username, roleName, email } = response.data.data;
                    setAuthState({
                        isAuthenticated: true,
                        user: {
                            id,
                            customerId,
                            username,
                            role: roleName,
                            email
                        },
                    });
                } else {
                    setAuthState(defaultAuth);
                }
            } catch (error) {
                removeToken();
                setAuthState(defaultAuth);
            } finally {
                setLoading(false);
            }
        };
        validateToken();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Function to handle user login
    const login = ({ id, username, role, accessToken, refreshToken }) => {
        // Add new token from local storage
        setToken(accessToken);
        setRefreshToken(refreshToken);
        // Update the authentication status and user information
        setAuthState({
            ...authState,
            isAuthenticated: true,
            user: {
                id,
                username,
                role,
            },
        });
    };

    // Function to handle user logout
    const logout = () => {
        // Remove the token from local storage
        removeToken();
        // Update the authentication status and user information
        setAuthState(defaultAuth);
        // Redirect or perform other actions upon logout
    };

    // Provide the authentication context values to the components
    const contextValues = {
        isAuthenticated: authState.isAuthenticated,
        user: authState.user,
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

