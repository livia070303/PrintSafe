import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function Header({ title = "🖨️ PRINTSENSE", dashboard = false }) {
  const { toggleTheme } = useTheme();

  return (
    <header className="app-header">
      <h1>{title}</h1>

      <div className="header-actions">
        <button
          className="btn btn-secondary"
          onClick={toggleTheme}
          aria-label="Alternar entre tema escuro e claro"
          type="button"
        >
          🌙 / ☀️
        </button>

        {dashboard ? (
          <>
            <Link className="btn btn-primary" to="/config">⚙️ Configuração</Link>
            <Link className="btn btn-primary" to="/about">ℹ️ Sobre</Link>
          </>
        ) : (
          <Link className="btn btn-primary" to="/">⬅ Voltar</Link>
        )}

        {dashboard && (
          <div className="status-badge" aria-live="polite">
            <span>● ONLINE</span>
          </div>
        )}
      </div>
    </header>
  );
}