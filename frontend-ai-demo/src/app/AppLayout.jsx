import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Brand from "../components/Brand";
import { logout } from "../api/services/auth";
import { getCurrentUser } from "../api/services/user";

export default function AppLayout() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const user = await getCurrentUser();
        if (!cancelled) {
          setCurrentUser(user);
        }
      } catch {
        if (!cancelled) {
          setCurrentUser(null);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="container py-4 drivium-shell">
      <div className="row g-3 align-items-start">
        <aside className="col-12 col-lg-3 col-xl-2">
          <div className="card drivium-card drivium-sidebar-sticky">
            <div className="card-body d-flex flex-column gap-2">
              <div className="mb-1">
                <Brand clickable />
              </div>

              <p className="small text-muted mb-1">
                Conectat: <span className="fw-semibold">{currentUser?.username ?? "-"}</span>
              </p>

              <Link to="/" className="btn btn-light btn-sm text-start border">
                MyDrive
              </Link>

              <div className="mt-auto">
                <button type="button" className="btn btn-outline-secondary btn-sm w-100" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </aside>

        <section className="col-12 col-lg-9 col-xl-10">
          <main className="card drivium-card h-100">
            <div className="card-body">
              <Outlet />
            </div>
          </main>
        </section>
      </div>
    </div>
  );
}
