import SignupForm from "../components/SignupForm";
import AuthRedirectLink from "../components/AuthRedirectLink";

function SignupPage() {
  return (
    <div className="container d-flex align-items-center justify-content-center py-5 shadow rounded">
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
  );
}

export default SignupPage;
