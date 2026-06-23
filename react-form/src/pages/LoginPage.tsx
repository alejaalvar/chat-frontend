import LoginForm from "../components/LoginForm";
import AuthRedirectLink from "../components/AuthRedirectLink";

function LoginPage() {
  return (
    <div className="container d-flex align-items-center justify-content-center py-5 shadow rounded-4 my-auto">
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
  );
}

export default LoginPage;
