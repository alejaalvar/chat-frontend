import { useNavigate } from "react-router-dom";
import { useState } from "react";
import EmailInput from "./EmailInput";
import PasswordInput from "./PasswordInput";
import AuthSubmit from "./AuthSubmit";
import AuthError from "./AuthError";

//const FAKE_EMAIL = "user@example.com";
//const FAKE_PASSWORD = "password123";

const API_URL = import.meta.env.VITE_API_URL;

async function login(email: string, password: string): Promise<boolean> {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message);
  }
  return data.user.profileSetup as boolean;
}

/*
function simulateLogin(email: string, password: string): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === FAKE_EMAIL && password === FAKE_PASSWORD) {
        resolve();
      } else {
        reject(new Error("Invalid email or password."));
      }
    }, 1000);
  });
}
*/

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const profileSetup = await login(email, password);
      navigate("/dashboard", { state: { profileSetup } });
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
        {error && <AuthError message={error} />}
        <div className="d-flex justify-content-center my-3">
          <AuthSubmit
            message={isLoading ? "Logging in..." : "Login"}
            isDisabled={isLoading}
          />
        </div>
      </div>
    </form>
  );
}

export default LoginForm;
