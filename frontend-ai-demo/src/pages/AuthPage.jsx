import { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import Brand from "../components/Brand";
import StatusAlert from "../components/StatusAlert";
import { login } from "../api/services/auth";
import { registerUser } from "../api/services/user";
import { getAccessToken } from "../api/client";
import { getErrorMessage } from "../utils/errors";

export default function AuthPage({ mode = "login" }) {
  const isRegister = mode === "register";
  const location = useLocation();
  const navigate = useNavigate();
  const token = getAccessToken();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
  }, [mode]);

  const from = location.state?.from?.pathname ?? "/";

  if (token) {
    return <Navigate to={from} replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (loading) {
      return;
    }

    setError("");
    setLoading(true);

    try {
      if (isRegister) {
        await registerUser({ username: username.trim(), email: email.trim(), password });
      }

      await login({ username: username.trim(), password });
      navigate(from, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, isRegister ? "Nu s-a putut crea contul." : "Autentificare eșuată."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container py-5" style={{ maxWidth: 480 }}>
      <div className="card drivium-card shadow-sm">
        <div className="card-body p-4">
          <div className="mb-3">
            <Brand />
          </div>

          <h1 className="h4 mb-3">{isRegister ? "Creează cont" : "Autentificare"}</h1>
          <StatusAlert message={error} onClose={() => setError("")} />

          <form onSubmit={handleSubmit} className="d-grid gap-3">
            <div>
              <label htmlFor="username" className="form-label mb-1">
                Username
              </label>
              <input
                id="username"
                type="text"
                className="form-control"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
                maxLength={64}
                autoFocus
                disabled={loading}
              />
            </div>

            {isRegister ? (
              <div>
                <label htmlFor="email" className="form-label mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            ) : null}

            <div>
              <label htmlFor="password" className="form-label mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="form-control"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                minLength={8}
                disabled={loading}
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Se procesează..." : isRegister ? "Creează cont" : "Intră în cont"}
            </button>
          </form>

          <p className="small text-muted mb-0 mt-3">
            {isRegister ? "Ai deja cont? " : "Nu ai cont? "}
            <Link to={isRegister ? "/login" : "/register"} className="text-decoration-none">
              {isRegister ? "Autentifică-te" : "Creează cont"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}