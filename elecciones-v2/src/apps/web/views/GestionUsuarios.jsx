import { useState } from "react";
import { useApp } from "../../../context/AppContext";

// ─── Colores de rol ────────────────────────────────────────────
const ROL_META = {
  gobernador: { label:"Gobernador",  color:"#f59e0b", bg:"#f59e0b20", icon:"🏛️" },
  candidato:  { label:"Candidato",   color:"#3b82f6", bg:"#3b82f620", icon:"🎯" },
  lider:      { label:"Líder",       color:"#10b981", bg:"#10b98120", icon:"🤝" },
};

const BLANK = { nombre:"", rol:"lider", email:"", phone:"", activo:true, refId:"" };

// ─── Modal Formulario ──────────────────────────────────────────
function ModalUsuario({ user, onSave, onClose }) {
  const { candidatos, lideres } = useApp();
  const [form, setForm] = useState(user ?? BLANK);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const refOptions = form.rol === "candidato"
    ? candidatos.map(c => ({ value: c.id, label: `${c.nombre} (${c.cargo} – ${c.municipio})` }))
    : form.rol === "lider"
      ? lideres.map(l => ({ value: l.id, label: `${l.nombre} – ${l.zona}` }))
      : [{ value: "GOB-1", label: "Eduardo Padilla Díaz (Gobernador)" }];

  const valid = form.nombre.trim() && form.email.trim() && form.phone.trim();

  return (
    <div style={{
      position:"fixed", inset:0, background:"#00000090", zIndex:1000,
      display:"flex", alignItems:"center", justifyContent:"center",
    }}>
      <div style={{
        background:"#0d1b3e", border:"1px solid #1e3a6e", borderRadius:18,
        width:480, maxHeight:"90vh", overflowY:"auto", padding:28,
      }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
          <h2 style={{ margin:0, fontSize:16, fontWeight:800, color:"#fff" }}>
            {user ? "✏️ Editar usuario" : "➕ Nuevo usuario"}
          </h2>
          <button onClick={onClose} style={{ background:"none", border:"none", color:"#64748b", fontSize:20, cursor:"pointer" }}>✕</button>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {/* Nombre */}
          <Field label="Nombre completo">
            <Input value={form.nombre} onChange={e => set("nombre", e.target.value)} placeholder="Ej. Juan Pérez López" />
          </Field>

          {/* Rol */}
          <Field label="Rol en el sistema">
            <select value={form.rol} onChange={e => set("rol", e.target.value)} style={selectSt}>
              <option value="gobernador">🏛️ Gobernador</option>
              <option value="candidato">🎯 Candidato</option>
              <option value="lider">🤝 Líder de campaña</option>
            </select>
          </Field>

          {/* Referencia */}
          {form.rol !== "gobernador" && (
            <Field label={form.rol === "candidato" ? "Candidatura asociada" : "Líder asociado"}>
              <select value={form.refId} onChange={e => set("refId", e.target.value)} style={selectSt}>
                <option value="">— Seleccionar —</option>
                {refOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </Field>
          )}

          {/* Email */}
          <Field label="Correo electrónico">
            <Input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="usuario@ejemplo.co" />
          </Field>

          {/* Teléfono */}
          <Field label="Teléfono / WhatsApp">
            <Input value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="3001234567" />
          </Field>

          {/* Estado */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", background:"#060c1a", borderRadius:10, padding:"12px 16px" }}>
            <span style={{ fontSize:13, color:"#94a3b8" }}>Estado de la cuenta</span>
            <button
              onClick={() => set("activo", !form.activo)}
              style={{
                background: form.activo ? "#10b98130" : "#ef444430",
                border: `1px solid ${form.activo ? "#10b981" : "#ef4444"}`,
                color: form.activo ? "#10b981" : "#ef4444",
                borderRadius:20, padding:"4px 14px", fontSize:12, fontWeight:700, cursor:"pointer",
              }}
            >
              {form.activo ? "✓ Activo" : "✗ Inactivo"}
            </button>
          </div>
        </div>

        <div style={{ display:"flex", gap:10, marginTop:24, justifyContent:"flex-end" }}>
          <Btn ghost onClick={onClose}>Cancelar</Btn>
          <Btn disabled={!valid} onClick={() => { if (valid) { onSave(form); onClose(); } }}>
            {user ? "Guardar cambios" : "Crear usuario"}
          </Btn>
        </div>
      </div>
    </div>
  );
}

// ─── Confirmación de borrado ───────────────────────────────────
function ModalConfirm({ nombre, onConfirm, onClose }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"#00000090", zIndex:1100, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ background:"#0d1b3e", border:"1px solid #ef444455", borderRadius:16, padding:28, width:380 }}>
        <p style={{ color:"#fff", fontSize:15, fontWeight:700, margin:"0 0 8px" }}>¿Eliminar usuario?</p>
        <p style={{ color:"#64748b", fontSize:13, margin:"0 0 20px" }}>
          Se eliminará <strong style={{ color:"#fff" }}>{nombre}</strong> del sistema. Esta acción no se puede deshacer.
        </p>
        <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
          <Btn ghost onClick={onClose}>Cancelar</Btn>
          <Btn danger onClick={() => { onConfirm(); onClose(); }}>Sí, eliminar</Btn>
        </div>
      </div>
    </div>
  );
}

// ─── Vista principal ───────────────────────────────────────────
export default function GestionUsuarios() {
  const { usuarios, addUsuario, updateUsuario, deleteUsuario, toggleActivo } = useApp();
  const [search,    setSearch]    = useState("");
  const [rolFilter, setRolFilter] = useState("all");
  const [modal,     setModal]     = useState(null);   // null | { mode:"add"|"edit", user? }
  const [confirm,   setConfirm]   = useState(null);   // null | { id, nombre }

  const filtered = usuarios.filter(u => {
    const matchRol    = rolFilter === "all" || u.rol === rolFilter;
    const matchSearch = !search || u.nombre.toLowerCase().includes(search.toLowerCase())
                                || u.email.toLowerCase().includes(search.toLowerCase());
    return matchRol && matchSearch;
  });

  const counts = {
    total:      usuarios.length,
    activos:    usuarios.filter(u => u.activo).length,
    gobernador: usuarios.filter(u => u.rol === "gobernador").length,
    candidato:  usuarios.filter(u => u.rol === "candidato").length,
    lider:      usuarios.filter(u => u.rol === "lider").length,
  };

  return (
    <div>
      {/* ── KPIs ── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:12, marginBottom:24 }}>
        {[
          { label:"Total usuarios",   value:counts.total,      color:"#e2e8f0" },
          { label:"Activos",          value:counts.activos,    color:"#10b981" },
          { label:"Gobernadores",     value:counts.gobernador, color:"#f59e0b" },
          { label:"Candidatos",       value:counts.candidato,  color:"#3b82f6" },
          { label:"Líderes",          value:counts.lider,      color:"#10b981" },
        ].map(k => (
          <div key={k.label} style={{ background:"#0d1b3e", border:"1px solid #1e3a6e", borderRadius:12, padding:"14px 18px" }}>
            <div style={{ fontSize:22, fontWeight:900, color:k.color }}>{k.value}</div>
            <div style={{ fontSize:10, color:"#4b6080", fontWeight:700, marginTop:2 }}>{k.label.toUpperCase()}</div>
          </div>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div style={{ display:"flex", gap:10, marginBottom:16, alignItems:"center", flexWrap:"wrap" }}>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="🔍  Buscar por nombre o correo…"
          style={{ ...inputSt, flex:1, minWidth:200 }}
        />
        <select value={rolFilter} onChange={e => setRolFilter(e.target.value)} style={{ ...selectSt, width:160 }}>
          <option value="all">Todos los roles</option>
          <option value="gobernador">🏛️ Gobernador</option>
          <option value="candidato">🎯 Candidatos</option>
          <option value="lider">🤝 Líderes</option>
        </select>
        <Btn onClick={() => setModal({ mode:"add" })}>+ Nuevo usuario</Btn>
      </div>

      {/* ── Tabla ── */}
      <div style={{ background:"#0d1b3e", border:"1px solid #1e3a6e", borderRadius:14, overflow:"hidden" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ background:"#060c1a" }}>
              {["Usuario","Rol","Correo","Teléfono","Estado","Acciones"].map(h => (
                <th key={h} style={{ padding:"11px 16px", textAlign:"left", fontSize:10, fontWeight:700, color:"#4b6080", letterSpacing:".06em" }}>
                  {h.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding:40, textAlign:"center", color:"#4b6080", fontSize:13 }}>
                  No se encontraron usuarios con los filtros aplicados.
                </td>
              </tr>
            )}
            {filtered.map((u, i) => {
              const rm = ROL_META[u.rol];
              return (
                <tr key={u.id} style={{ borderTop:"1px solid #1e3a6e14", background: i % 2 === 0 ? "transparent" : "#060c1a20" }}>
                  {/* Nombre */}
                  <td style={{ padding:"12px 16px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <div style={{
                        width:34, height:34, borderRadius:10,
                        background: `${rm.color}22`, border:`1px solid ${rm.color}44`,
                        display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, flexShrink:0,
                      }}>
                        {rm.icon}
                      </div>
                      <div>
                        <div style={{ fontSize:13, fontWeight:700, color:"#e2e8f0" }}>{u.nombre}</div>
                        <div style={{ fontSize:10, color:"#4b6080" }}>{u.id}</div>
                      </div>
                    </div>
                  </td>
                  {/* Rol */}
                  <td style={{ padding:"12px 16px" }}>
                    <span style={{
                      background:rm.bg, color:rm.color, border:`1px solid ${rm.color}44`,
                      borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:700,
                    }}>
                      {rm.icon} {rm.label}
                    </span>
                  </td>
                  {/* Email */}
                  <td style={{ padding:"12px 16px", fontSize:12, color:"#94a3b8" }}>{u.email}</td>
                  {/* Teléfono */}
                  <td style={{ padding:"12px 16px", fontSize:12, color:"#94a3b8" }}>{u.phone}</td>
                  {/* Estado */}
                  <td style={{ padding:"12px 16px" }}>
                    <button
                      onClick={() => toggleActivo(u.id)}
                      style={{
                        background: u.activo ? "#10b98118" : "#ef444418",
                        border:`1px solid ${u.activo ? "#10b981" : "#ef4444"}44`,
                        color: u.activo ? "#10b981" : "#ef4444",
                        borderRadius:20, padding:"3px 12px", fontSize:11, fontWeight:700, cursor:"pointer",
                      }}
                    >
                      {u.activo ? "● Activo" : "○ Inactivo"}
                    </button>
                  </td>
                  {/* Acciones */}
                  <td style={{ padding:"12px 16px" }}>
                    <div style={{ display:"flex", gap:6 }}>
                      <ActionBtn
                        color="#3b82f6"
                        onClick={() => setModal({ mode:"edit", user: u })}
                        title="Editar"
                      >✏️</ActionBtn>
                      {u.rol !== "gobernador" && (
                        <ActionBtn
                          color="#ef4444"
                          onClick={() => setConfirm({ id: u.id, nombre: u.nombre })}
                          title="Eliminar"
                        >🗑️</ActionBtn>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div style={{ padding:"10px 16px", borderTop:"1px solid #1e3a6e", fontSize:11, color:"#4b6080" }}>
          Mostrando {filtered.length} de {usuarios.length} usuarios
        </div>
      </div>

      {/* Modales */}
      {modal?.mode === "add" && (
        <ModalUsuario
          onSave={addUsuario}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.mode === "edit" && (
        <ModalUsuario
          user={modal.user}
          onSave={updateUsuario}
          onClose={() => setModal(null)}
        />
      )}
      {confirm && (
        <ModalConfirm
          nombre={confirm.nombre}
          onConfirm={() => deleteUsuario(confirm.id)}
          onClose={() => setConfirm(null)}
        />
      )}
    </div>
  );
}

// ─── Primitivos UI ─────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div>
      <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#4b6080", marginBottom:5, letterSpacing:".05em" }}>
        {label.toUpperCase()}
      </label>
      {children}
    </div>
  );
}

function Input(props) {
  return <input {...props} style={inputSt} />;
}

function Btn({ children, onClick, ghost, danger, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding:"9px 18px", borderRadius:9, fontSize:12, fontWeight:700, cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        background: ghost ? "transparent" : danger ? "#ef444420" : "#2563eb",
        border: ghost ? "1px solid #1e3a6e" : danger ? "1px solid #ef4444" : "none",
        color: ghost ? "#94a3b8" : danger ? "#ef4444" : "#fff",
      }}
    >
      {children}
    </button>
  );
}

function ActionBtn({ children, color, onClick, title }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        width:30, height:30, borderRadius:8, border:`1px solid ${color}33`,
        background:`${color}15`, color, fontSize:14, cursor:"pointer",
        display:"flex", alignItems:"center", justifyContent:"center",
      }}
    >
      {children}
    </button>
  );
}

const inputSt = {
  width:"100%", background:"#060c1a", border:"1px solid #1e3a6e", borderRadius:9,
  padding:"9px 12px", color:"#e2e8f0", fontSize:13, outline:"none", boxSizing:"border-box",
};

const selectSt = {
  background:"#060c1a", border:"1px solid #1e3a6e", borderRadius:9,
  padding:"9px 12px", color:"#e2e8f0", fontSize:13, outline:"none", cursor:"pointer",
};
