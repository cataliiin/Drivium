import { Outlet, Link } from "react-router-dom";

export default function AppLayout() {
  return (
    <div style={{ minHeight: "100vh", padding: 16 }}>
      <header
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          marginBottom: 16,
          padding: 12,
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          background: "var(--panel)",
          boxShadow: "var(--shadow)",
        }}
      >
        <Link to="/" style={{ fontWeight: 700 }}>
          Drivium
        </Link>
        <nav style={{ display: "flex", gap: 10 }}>
          <Link to="/">Drive</Link>
          <Link to="/shared-with-me">Shared</Link>
          <Link to="/trash">Trash</Link>
        </nav>
      </header>

      <main
        style={{
          padding: 12,
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          background: "var(--panel)",
          boxShadow: "var(--shadow)",
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}
