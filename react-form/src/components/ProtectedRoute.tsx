import { useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const API_URL = import.meta.env.VITE_API_URL;

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(!user);

  useEffect(() => {
    if (user) return;

    fetch(`${API_URL}/api/auth/userinfo`, { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then((data) => {
        setUser(data);
        setChecking(false);
      })
      .catch(() => navigate("/login", { replace: true }));
  }, []);

  if (checking) {
    return (
      <div className="d-flex min-vh-100 align-items-center justify-content-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
