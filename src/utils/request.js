import axios from "axios";

const request = axios.create({
    baseURL: 'http://localhost:8080/api/v1/',
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
