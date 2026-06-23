import SignupForm from "../components/SignupForm";
import AuthRedirectLink from "../components/AuthRedirectLink";

function SignupPage() {
  return (
    <div className="d-flex min-vh-100 align-items-center justify-content-center">
      <div className="container d-flex align-items-center justify-content-center py-5 shadow rounded-4">
        <main>
          <h1 className="text-center">Signup</h1>
          <SignupForm />
          <AuthRedirectLink
            message="Already have an account?"
            linkText="Login!"
            to="/login"
          />
        </main>
      </div>
    </div>
  );
}

export default SignupPage;
