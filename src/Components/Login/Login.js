function Login() {
    return (
        <form>
            <h3>Đăng nhập Book360</h3>
            <div>
                <label for="floatingInput">Nhập tên tài khoản/Email</label>
                <input type="email" id="floatingInput" placeholder="name@example.com" />
            </div>
            <div>
                <label for="floatingPassword">Mật khẩu</label>
                <input type="password" id="floatingPassword" placeholder="Password" />
            </div>
            <button type="submit">Đăng nhập</button>
        </form>
    );
}

export default Login;