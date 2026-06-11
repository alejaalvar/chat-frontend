import { Link } from "react-router-dom";
import LoginForm from "../components/LoginForm";

function LoginPage() {
    return (
        <div className="container d-flex align-items-center justify-content-center py-5">
            <main>
            <div className="d-flex justify-content-center">
                <h1>Login</h1>
            </div>
            <LoginForm />
                <div className="d-flex justify-content-center">
                    <p>
                        Don't have an account?{" "}
                        <Link to="/signup">Sign up!</Link>
                    </p>
                </div>
            </main>
        </div>
    )
}

export default LoginPage;
