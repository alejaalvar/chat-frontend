import { useNavigate } from "react-router-dom";
import EmailInput from "./EmailInput";
import PasswordInput from "./PasswordInput";

function LoginForm() {
    const navigate = useNavigate();
    const handleSubmit = (e: React.SubmitEvent) => {
       e.preventDefault(); // w/o this we can navigate w/empty fieldsets
       navigate('/dashboard')
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="row">
                <EmailInput />
                <PasswordInput />
                <div className="d-flex justify-content-center my-3">
                    <button className="btn btn-primary w-100" type="submit">Login</button>
                </div>
            </div>
        </form>
    )
}

export default LoginForm;
