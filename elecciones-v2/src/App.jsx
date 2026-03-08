import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import VotoControl from "./apps/web/VotoControl";
import LiderMovil from "./apps/mobile/LiderMovil";

function Home() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#060c1a",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "2rem",
      fontFamily: "Sora, sans-serif",
    }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 800, color: "#fff", marginBottom: "0.5rem" }}>
          🗳️ VotoControl Pro
        </h1>
        <p style={{ color: "#64748b", fontSize: "1rem" }}>
          Plataforma Electoral — Sucre 2027
        </p>
      </div>
      <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", justifyContent: "center" }}>
        <Link to="/control" style={{
          padding: "1.25rem 2.5rem",
          background: "linear-gradient(135deg, #1d4ed8, #2563eb)",
          borderRadius: "12px",
          color: "#fff",
          textDecoration: "none",
          fontWeight: 700,
          fontSize: "1rem",
          boxShadow: "0 4px 24px rgba(37,99,235,0.4)",
        }}>
          🖥️ Panel de Control Web
        </Link>
        <Link to="/lider" style={{
          padding: "1.25rem 2.5rem",
          background: "linear-gradient(135deg, #065f46, #059669)",
          borderRadius: "12px",
          color: "#fff",
          textDecoration: "none",
          fontWeight: 700,
          fontSize: "1rem",
          boxShadow: "0 4px 24px rgba(5,150,105,0.4)",
        }}>
          📱 App Líder Móvil
        </Link>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/control" element={<VotoControl />} />
          <Route path="/lider" element={<LiderMovil />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
