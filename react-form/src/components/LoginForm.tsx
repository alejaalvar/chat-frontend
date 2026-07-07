import { useNavigate } from "react-router-dom";
import { useState } from "react";
import EmailInput from "./EmailInput";
import PasswordInput from "./PasswordInput";
import AuthSubmit from "./AuthSubmit";
import AuthError from "./AuthError";
import { useUser } from "../context/UserContext";
import type { User } from "../context/UserContext";

const API_URL = import.meta.env.VITE_API_URL;

async function login(
  email: string,
  password: string,
): Promise<{ user: User; token: string }> {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message ?? "Login failed");
  }
  const data = await res.json();
  return { user: data.user as User, token: data.token as string };
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
  const { setUser, setToken } = useUser();

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { user, token } = await login(email, password);
      setUser(user);
      setToken(token);
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
