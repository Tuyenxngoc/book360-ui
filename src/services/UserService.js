import axios from "axios";

const loginApi = (emailOrUsername, password) => {
    return axios.post('http://localhost:8080/api/v1/auth/login', { emailOrUsername, password });
}

export { loginApi };