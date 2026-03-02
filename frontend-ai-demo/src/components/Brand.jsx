import { Link } from "react-router-dom";

export default function Brand({ clickable = false }) {
  const content = (
    <span className="d-inline-flex align-items-center fw-semibold text-dark">Drivium</span>
  );

  if (!clickable) {
    return content;
  }

  return (
    <Link to="/" className="text-decoration-none">
      {content}
    </Link>
  );
}
