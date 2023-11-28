import axios from "axios";
import config from "~/config";
import { getRefreshToken, getToken, setRefreshToken, setToken } from '~/services/authService';

// Create a base axios instance for general requests
const httpRequest = axios.create({
    baseURL: config.API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    },
});

// Create a separate axios instance for private requests (with Authorization header)
export const axiosPrivate = axios.create({
    baseURL: config.API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    },
});

const refresh = async () => {
    try {
        const response = await axiosPrivate.post('auth/refresh-token', {
            refreshToken: getRefreshToken(),
        });

        // Lưu trữ access token mới
        const { accessToken, refreshToken } = response.data.data;
        setToken(accessToken);
        setRefreshToken(refreshToken);

        return accessToken;
    } catch (error) {
        console.error("Error refreshing token:", error);
        throw error; // Re-throw the error to handle it elsewhere if needed
    }
};

// Thêm interceptor cho mọi request
axiosPrivate.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Thêm interceptor cho mọi response
axiosPrivate.interceptors.response.use(
    (response) => response,
    async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 401 && !prevRequest?.sent) {
            prevRequest.sent = true;

            try {
                const newAccessToken = await refresh();
                prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return axiosPrivate(prevRequest);
            } catch (refreshError) {
                console.error("Error retrying request after token refresh:", refreshError);
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default httpRequest;
