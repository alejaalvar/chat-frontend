import { useNavigate } from "react-router-dom";
import { useState } from "react";
import EmailInput from "./EmailInput";
import PasswordInput from "./PasswordInput";
import AuthSubmit from "./AuthSubmit";
import AuthError from "./AuthError";
import { useUser } from "../context/UserContext";
import type { User } from "../context/UserContext";

const API_URL = import.meta.env.VITE_API_URL;

async function signup(email: string, password: string): Promise<User> {
  const res = await fetch(`${API_URL}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message ?? "Signup failed");
  }
  const data = await res.json();
  return data.user as User;
}

function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(false);

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isMatch = password === confirmPassword;
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault(); // w/o this we can navigate w/empty fieldsets
    if (!isMatch) {
      setError("Passwords do not match.");
      return;
    }
    setError(null);
    setLoading(false);
    if (!isMatch || !isValidEmail) {
      return;
    }
    try {
      const user = await signup(email, password);
      setUser(user);
      navigate("/dashboard");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        <div className="form-group p-3 col-12">
          <EmailInput
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
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
        {error && <AuthError message={error} />}
        <div className="d-flex justify-content-center my-3">
          <AuthSubmit
            message={isLoading ? "Loading..." : "Signup"}
            isDisabled={isLoading}
          />
        </div>
      </div>
    </form>
  );
}

export default SignupForm;
