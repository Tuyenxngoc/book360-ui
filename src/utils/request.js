import axios from "axios";

const request = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {}
});

// Hàm để thiết lập token
export function setAuthToken(token) {
    if (token) {
        request.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete request.defaults.headers.common['Authorization'];
    }
}

export default request;
