import { Link, Outlet } from "react-router-dom";
import AuthButtons from "../components/AuthButtons";
import "./AppLayout.css";

export default function AppLayout() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="header-content">
          <Link to="/" className="app-brand">
            <div className="brand-icon">🌤️</div>
            <span className="brand-text">Weather App</span>
          </Link>
          <div className="app-actions">
            <AuthButtons />
          </div>
        </div>
      </header>

      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}