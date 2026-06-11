import { Link } from "react-router-dom";
import LoginForm from "../components/LoginForm";

function LoginPage() {
    return (
        <div className="container d-flex align-items-center justify-content-center py-5">
            <main>
            <h1 className="text-center">Login</h1>
            <LoginForm />
                <p className="text-center">
                    Don't have an account?{" "}
                    <Link to="/signup">Sign up!</Link>
                </p>
            </main>
        </div>
    )
}

export default LoginPage;
