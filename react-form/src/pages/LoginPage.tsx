import { Link, useNavigate } from "react-router-dom";

function LoginPage() {
    const navigate = useNavigate();
    const handleSubmit = (e: React.SubmitEvent) => {
       e.preventDefault(); // w/o this we can navigate w/empty fieldsets
       navigate('/dashboard')
    }

    return (
        <div className="container d-flex align-items-center justify-content-center py-5">
            <main>
            <div className="d-flex justify-content-center">
                <h1>Login</h1>
            </div>
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="form-group p-3 col-12">
                            <label htmlFor="email">Email: </label>
                            <input className="form-control" placeholder="johndoe123@gmail.com" id="email" type="email" aria-describedby="emailHelp" required/>
                            <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                        </div>
                        <div className="form-group p-3 col-12">
                            <label htmlFor="password">Password: </label>
                            <input className="form-control" id="password" type="password" required/>
                        </div>
                        <div className="d-flex justify-content-center my-3">
                            <button className="btn btn-primary w-100" type="submit">Login</button>
                        </div>
                    </div>
                </form>
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
