import { useNavigate } from "react-router-dom";
import EmailInput from "./EmailInput";
import PasswordInput from "./PasswordInput";
import AuthSubmit from "./AuthSubmit";

function SignupForm() {
  const navigate = useNavigate();
  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault(); // w/o this we can navigate w/empty fieldsets
    navigate("/dashboard");
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        <div className="form-group p-3 col-12">
          <EmailInput />
        </div>
        <div className="form-group p-3 col-12">
          <PasswordInput label="Password:" id="password" />
        </div>
        <div className="form-group p-3 col-12">
          <PasswordInput label="Confirm Password:" id="confirm-password" />
        </div>
        <div className="d-flex justify-content-center my-3">
          <AuthSubmit message="Signup" />
        </div>
      </div>
    </form>
  );
}

export default SignupForm;
