import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Brand from "../components/Brand";
import { isBackendOnline } from "../api/services/system";

export default function ServiceOfflinePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");

  async function handleRetry() {
    if (checking) {
      return;
    }

    setChecking(true);
    setError("");

    const online = await isBackendOnline();

    if (online) {
      const target = location.state?.from?.pathname ?? "/";
      navigate(target, { replace: true });
      return;
    }

    setError("Serverul este încă indisponibil.");
    setChecking(false);
  }

  return (
    <div className="container py-5" style={{ maxWidth: 560 }}>
      <div className="card drivium-card shadow-sm">
        <div className="card-body p-4 text-center d-grid gap-2">
          <div>
            <Brand />
          </div>
          <h1 className="h4 mb-1">Service Offline</h1>
          <p className="text-muted mb-2">Backend-ul nu răspunde momentan. Încearcă din nou în câteva secunde.</p>
          {error ? <div className="alert alert-warning py-2 mb-2">{error}</div> : null}
          <button type="button" className="btn btn-primary" onClick={handleRetry} disabled={checking}>
            {checking ? "Verific..." : "Reîncearcă"}
          </button>
        </div>
      </div>
    </div>
  );
}
