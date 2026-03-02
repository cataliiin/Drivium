import { Link } from "react-router-dom";
import Brand from "../components/Brand";

export default function NotFoundPage() {
  return (
    <div className="container py-5" style={{ maxWidth: 560 }}>
      <div className="card drivium-card shadow-sm">
        <div className="card-body p-4 text-center d-grid gap-2">
          <div>
            <Brand />
          </div>
          <h1 className="h4 mb-1">Pagina nu a fost găsită</h1>
          <p className="text-muted mb-2">URL-ul cerut nu există.</p>
          <Link to="/" className="btn btn-primary">
            Înapoi în Drive
          </Link>
        </div>
      </div>
    </div>
  );
}