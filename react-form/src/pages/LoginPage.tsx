import LoginForm from "../components/LoginForm";
import AuthRedirectLink from "../components/AuthRedirectLink";

function LoginPage() {
  return (
    <div className="d-flex min-vh-100 align-items-center justify-content-center">
      <div className="container d-flex align-items-center justify-content-center py-5 shadow rounded-4">
        <main>
          <h1 className="text-center">Login</h1>
          <LoginForm />
          <AuthRedirectLink
            message="Don't have an account?"
            linkText="Sign up!"
            to="/signup"
          />
        </main>
      </div>
    </div>
  );
}

export default LoginPage;
