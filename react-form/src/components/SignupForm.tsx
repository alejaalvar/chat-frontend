import { useNavigate } from "react-router-dom";
import { useState } from "react";
import EmailInput from "./EmailInput";
import PasswordInput from "./PasswordInput";
import AuthSubmit from "./AuthSubmit";

function SignupForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const isMatch = password === confirmPassword;
  const navigate = useNavigate();
  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault(); // w/o this we can navigate w/empty fieldsets
    if (!isMatch) {
      return;
    }
    navigate("/dashboard");
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        <div className="form-group p-3 col-12">
          <EmailInput />
        </div>
        <div className="form-group p-3 col-12">
          <PasswordInput
            label="Password:"
            id="password"
            currentValue={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-group p-3 col-12">
          <PasswordInput
            label="Confirm Password:"
            id="confirm-password"
            currentValue={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        {!isMatch && (
          <small className="text-muted">Passwords do not match</small>
        )}
        <div className="d-flex justify-content-center my-3">
          <AuthSubmit message="Signup" />
        </div>
      </div>
    </form>
  );
}

export default SignupForm;
