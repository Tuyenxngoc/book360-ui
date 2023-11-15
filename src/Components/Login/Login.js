function Login() {
    return (
        <form>
            <h1>Please sign in</h1>
            <div>
                <input type="email" id="floatingInput" placeholder="name@example.com" />
                <label for="floatingInput">Email address</label>
            </div>
            <div>
                <input type="password" id="floatingPassword" placeholder="Password" />
                <label for="floatingPassword">Password</label>
            </div>

            <div>
                <input type="checkbox" value="remember-me" id="flexCheckDefault" />
                <label for="flexCheckDefault">
                    Remember me
                </label>
            </div>
            <button type="submit">Sign in</button>
        </form>
    );
}

export default Login;