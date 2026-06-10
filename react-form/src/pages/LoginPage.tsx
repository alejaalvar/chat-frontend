import { useNavigate } from "react-router-dom";

function LoginPage() {
    const navigate = useNavigate();
    const handleSubmit = (e: React.SubmitEvent) => {
       e.preventDefault(); // w/o this we can navigate w/empty fieldsets
       navigate('/dashboard')
    }

    return (
        <div className="container d-flex min-vh-100">
            <main className="m-auto">
            <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email: </label>
                        <input placeholder="johndoe123@gmail.com" id="email" type="email" required/>
                    </div>
                    <div className="form-group m-1">
                        <label htmlFor="password">Password: </label>
                        <input id="password" type="password" required/>
                    </div>
                    <button className="btn btn-primary" type="submit">Login</button>
                </form>
            </main>
        </div>
    )
}

export default LoginPage;
