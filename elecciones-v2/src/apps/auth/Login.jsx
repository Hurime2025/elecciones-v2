import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";

const ROL_REDIRECT = {
  gobernador: "/control",
  candidato:  "/control",
  lider:      "/lider",
};

const ROL_META = {
  gobernador: { icon:"🏛️", label:"Gobernador",  color:"#f59e0b" },
  candidato:  { icon:"🎯", label:"Candidato",   color:"#3b82f6" },
  lider:      { icon:"🤝", label:"Líder",        color:"#10b981" },
};

// Cuentas de demo visibles al usuario
const DEMO_ACCOUNTS = [
  { email:"epadilla@sucre.gov.co",  label:"Eduardo Padilla",   rol:"gobernador" },
  { email:"cmartinez@campana.co",   label:"Carlos Martínez",   rol:"candidato"  },
  { email:"ftorres@red.co",         label:"Franklyn Torres",   rol:"lider"      },
];

export default function Login() {
  const { login }    = useApp();
  const navigate     = useNavigate();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [showPwd,  setShowPwd]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    // Simular latencia de red
    await new Promise(r => setTimeout(r, 600));
    const result = login(email.trim(), password);
    setLoading(false);
    if (!result.ok) { setError(result.error); return; }
    navigate(ROL_REDIRECT[result.user.rol] ?? "/", { replace: true });
  };

  const fillDemo = (acc) => {
    setEmail(acc.email);
    setPassword("voto2027");
    setError("");
  };

  return (
    <div style={{
      minHeight:"100vh", background:"#060c1a",
      display:"flex", alignItems:"center", justifyContent:"center",
      fontFamily:"'Sora','DM Sans',sans-serif", padding:16,
    }}>
      {/* Fondo decorativo */}
      <div style={{ position:"fixed", inset:0, overflow:"hidden", pointerEvents:"none" }}>
        <div style={{ position:"absolute", top:-200, left:-200, width:600, height:600, borderRadius:"50%", background:"radial-gradient(circle,#1d4ed820,transparent 70%)" }}/>
        <div style={{ position:"absolute", bottom:-200, right:-200, width:600, height:600, borderRadius:"50%", background:"radial-gradient(circle,#f59e0b10,transparent 70%)" }}/>
      </div>

      <div style={{ width:"100%", maxWidth:420, position:"relative" }}>

        {/* Logo / Brand */}
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{
            width:60, height:60, borderRadius:18,
            background:"linear-gradient(135deg,#f59e0b,#b45309)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:28, margin:"0 auto 16px",
            boxShadow:"0 8px 32px #f59e0b40",
          }}>🗳️</div>
          <h1 style={{ fontSize:24, fontWeight:900, color:"#fff", margin:"0 0 4px", letterSpacing:"-.5px" }}>
            VotoControl <span style={{ color:"#f59e0b" }}>Pro</span>
          </h1>
          <p style={{ fontSize:12, color:"#334155", margin:0 }}>PLATAFORMA ELECTORAL · SUCRE 2027</p>
        </div>

        {/* Card formulario */}
        <div style={{
          background:"#0d1b3e", border:"1px solid #1e3a6e",
          borderRadius:20, padding:32,
          boxShadow:"0 24px 64px #00000060",
        }}>
          <h2 style={{ fontSize:16, fontWeight:800, color:"#fff", margin:"0 0 24px" }}>
            Ingresa a tu cuenta
          </h2>

          <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:16 }}>

            {/* Email */}
            <div>
              <label style={labelSt}>Correo electrónico</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="usuario@ejemplo.co"
                required
                style={inputSt}
                autoComplete="username"
              />
            </div>

            {/* Password */}
            <div>
              <label style={labelSt}>Contraseña</label>
              <div style={{ position:"relative" }}>
                <input
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{ ...inputSt, paddingRight:44 }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(p => !p)}
                  style={{
                    position:"absolute", right:12, top:"50%", transform:"translateY(-50%)",
                    background:"none", border:"none", color:"#4b6080", cursor:"pointer", fontSize:16,
                  }}
                >{showPwd ? "🙈" : "👁️"}</button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                background:"#ef444418", border:"1px solid #ef444455",
                borderRadius:10, padding:"10px 14px",
                color:"#ef4444", fontSize:13, fontWeight:600,
              }}>
                ⚠️ {error}
              </div>
            )}

            {/* Botón */}
            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop:4, padding:"13px", borderRadius:12, border:"none",
                background: loading ? "#1e3a6e" : "linear-gradient(135deg,#2563eb,#1d4ed8)",
                color:"#fff", fontSize:14, fontWeight:800, cursor: loading ? "not-allowed" : "pointer",
                boxShadow: loading ? "none" : "0 4px 20px #2563eb50",
                transition:"all .2s",
              }}
            >
              {loading ? "⏳ Verificando…" : "Iniciar sesión →"}
            </button>
          </form>
        </div>

        {/* Accesos demo */}
        <div style={{ marginTop:20, background:"#07101f", border:"1px solid #1e3a6e44", borderRadius:14, padding:20 }}>
          <div style={{ fontSize:10, fontWeight:700, color:"#334155", letterSpacing:".08em", marginBottom:12 }}>
            ACCESOS DE DEMO — contraseña: <span style={{ color:"#f59e0b", fontFamily:"monospace" }}>voto2027</span>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {DEMO_ACCOUNTS.map(acc => {
              const rm = ROL_META[acc.rol];
              return (
                <button key={acc.email} onClick={() => fillDemo(acc)} style={{
                  display:"flex", alignItems:"center", gap:10,
                  background:"transparent", border:`1px solid #1e3a6e`,
                  borderRadius:10, padding:"9px 12px", cursor:"pointer",
                  textAlign:"left", transition:"border-color .15s",
                  width:"100%",
                }}>
                  <span style={{
                    width:32, height:32, borderRadius:9, flexShrink:0,
                    background:`${rm.color}20`, border:`1px solid ${rm.color}44`,
                    display:"flex", alignItems:"center", justifyContent:"center", fontSize:15,
                  }}>{rm.icon}</span>
                  <div>
                    <div style={{ fontSize:12, fontWeight:700, color:"#e2e8f0" }}>{acc.label}</div>
                    <div style={{ fontSize:10, color:"#4b6080" }}>{acc.email}</div>
                  </div>
                  <span style={{
                    marginLeft:"auto", background:`${rm.color}18`,
                    color:rm.color, border:`1px solid ${rm.color}33`,
                    borderRadius:20, padding:"2px 10px", fontSize:10, fontWeight:700,
                  }}>{rm.label}</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

const labelSt = {
  display:"block", fontSize:11, fontWeight:700,
  color:"#4b6080", marginBottom:6, letterSpacing:".05em",
};
const inputSt = {
  width:"100%", background:"#060c1a", border:"1px solid #1e3a6e",
  borderRadius:10, padding:"11px 14px", color:"#e2e8f0", fontSize:13,
  outline:"none", boxSizing:"border-box", transition:"border-color .15s",
};
