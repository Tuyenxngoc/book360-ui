import axios from "axios";
import config from "~/config";

const httpRequest = axios.create({
    baseURL: config.API_URL
});

export const axiosPrivate = axios.create({
    baseURL: config.API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
    },
})

const refresh = async () => {
    const response = await axiosPrivate.get('/api/v1/auth/refresh-token')
    return response.data.accessToken;
}

// Thêm interceptor cho mọi request
axiosPrivate.interceptors.request.use(
    config => {
        if (!config.headers['Authorization']) {
            config.headers['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`;
        }
        return config;
    }, (error) => Promise.reject(error)
);

// Thêm interceptor cho mọi response
axiosPrivate.interceptors.response.use(
    response => response,
    async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 403 && !prevRequest?.sent) {
            prevRequest.sent = true;
            const newAccessToken = await refresh();
            prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            return axiosPrivate(prevRequest);
        }
        return Promise.reject(error);
    }
);

export default httpRequest;
