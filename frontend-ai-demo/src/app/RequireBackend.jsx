import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isBackendOnline } from "../api/services/system";

export default function RequireBackend() {
  const location = useLocation();
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const online = await isBackendOnline();
      if (!cancelled) {
        setIsOnline(online);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (isOnline === null) {
    return (
      <div className="container py-5" style={{ maxWidth: 540 }}>
        <div className="card drivium-card">
          <div className="card-body text-center py-4">
            <p className="mb-0 text-muted">Verific conexiunea cu serverul...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isOnline) {
    return <Navigate to="/service-offline" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
