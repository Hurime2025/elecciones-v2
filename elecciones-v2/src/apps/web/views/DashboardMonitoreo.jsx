import { useState } from "react";
import { useApp } from "../../../context/AppContext";

// ─── Helpers ──────────────────────────────────────────────────
const fmt   = n => Number(n||0).toLocaleString("es-CO");
const pct   = (a, b) => b ? Math.round((a / b) * 100) : 0;
const clamp = (v, min=0, max=100) => Math.max(min, Math.min(max, v));

function Ring({ valor, total, color, size = 56 }) {
  const r    = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const fill = circ * clamp(valor / Math.max(total, 1));
  return (
    <svg width={size} height={size} style={{ transform:"rotate(-90deg)", flexShrink:0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1e3a6e" strokeWidth={6}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={6}
        strokeDasharray={`${fill} ${circ}`} strokeLinecap="round"/>
    </svg>
  );
}

// ─── KPI chip ─────────────────────────────────────────────────
function Kpi({ label, value, sub, color = "#e2e8f0", warn }) {
  return (
    <div style={{ background:"#060c1a", borderRadius:10, padding:"12px 14px", minWidth:110 }}>
      <div style={{ fontSize:18, fontWeight:900, color: warn ? "#ef4444" : color }}>{value}</div>
      {sub && <div style={{ fontSize:10, color: warn ? "#ef444480" : color + "80", fontWeight:700 }}>{sub}</div>}
      <div style={{ fontSize:9, color:"#334155", fontWeight:700, marginTop:3, letterSpacing:".05em" }}>{label.toUpperCase()}</div>
    </div>
  );
}

// ─── Card por candidato ────────────────────────────────────────
function CandidatoCard({ c, votantes, onEdit }) {
  const registrados  = votantes.filter(v => v.campañas?.includes(c.id)).length;
  const confirmados  = votantes.filter(v => v.estado?.[c.id] === "confirmado").length;
  const pendientes   = votantes.filter(v => v.estado?.[c.id] === "pendiente").length;
  const sinContacto  = registrados - confirmados - pendientes;

  // Votos castigados: registrados que NO son confirmados
  const castigados   = registrados - confirmados;
  const pctCastigado = pct(castigados, registrados);

  // Avance sobre meta
  const pctMeta      = pct(confirmados, c.meta);

  // Votos contrarios totales
  const totalContrarios = (c.contrarios ?? []).reduce((s, x) => s + Number(x.votos || 0), 0);

  // Votos disponibles (censo - contrarios - ya confirmados propios)
  const disponibles  = Math.max(0, (c.censo || 0) - totalContrarios - confirmados);

  // Votos reales necesarios ajustados por castigo
  // Formula: Si el 40% de registrados se castigan, necesitas registrar meta/(1-pctCastigo/100) para confirmar la meta
  const factorCastigo   = registrados > 0 ? castigados / registrados : 0.3; // default 30%
  const metaAjustada    = Math.ceil(c.meta / Math.max(1 - factorCastigo, 0.01));

  // Brecha real: cuántos más necesitamos registrar
  const brechaRegistro  = Math.max(0, metaAjustada - registrados);

  const barWidth = clamp(pctMeta);

  return (
    <div style={{
      background:"#0d1b3e", border:`1px solid ${c.color}33`,
      borderRadius:16, padding:20, marginBottom:16,
    }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{
            width:42, height:42, borderRadius:12, flexShrink:0,
            background:`${c.color}22`, border:`1px solid ${c.color}55`,
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:18,
          }}>
            {c.cargo === "Alcalde" ? "🏛️" : c.cargo === "Concejal" ? "🏅" : "📋"}
          </div>
          <div>
            <div style={{ fontSize:15, fontWeight:800, color:"#fff" }}>{c.nombre}</div>
            <div style={{ fontSize:11, color:"#4b6080" }}>{c.cargo} · {c.municipio}</div>
          </div>
        </div>
        <button onClick={() => onEdit(c)} style={{
          background:"#1e3a6e30", border:"1px solid #1e3a6e",
          borderRadius:8, padding:"5px 12px", color:"#64748b",
          fontSize:11, cursor:"pointer", fontWeight:600,
        }}>✏️ Editar</button>
      </div>

      {/* Barra de progreso meta */}
      <div style={{ marginBottom:16 }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
          <span style={{ fontSize:11, color:"#64748b" }}>Avance hacia meta</span>
          <span style={{ fontSize:12, fontWeight:800, color: pctMeta >= 100 ? "#10b981" : c.color }}>
            {fmt(confirmados)} / {fmt(c.meta)} · {pctMeta}%
          </span>
        </div>
        <div style={{ height:8, background:"#060c1a", borderRadius:6, overflow:"hidden" }}>
          <div style={{
            width:`${barWidth}%`, height:"100%",
            background:`linear-gradient(90deg, ${c.color}, ${c.color}cc)`,
            borderRadius:6, transition:"width .4s ease",
          }}/>
        </div>
      </div>

      {/* KPIs fila */}
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:16 }}>
        <div style={{ position:"relative" }}>
          <Ring valor={confirmados} total={c.meta} color={c.color} size={52}/>
          <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ fontSize:9, fontWeight:900, color:c.color }}>{pctMeta}%</span>
          </div>
        </div>
        <Kpi label="Votos requeridos"   value={fmt(c.meta)}       color={c.color}   />
        <Kpi label="Registrados"        value={fmt(registrados)}  color="#e2e8f0"   />
        <Kpi label="Confirmados"        value={fmt(confirmados)}  color="#10b981"   />
        <Kpi label="Pendientes"         value={fmt(pendientes)}   color="#f59e0b"   />
        <Kpi label="% Castigados"       value={`${pctCastigado}%`} sub={`${fmt(castigados)} votos`}
          color="#ef4444" warn={pctCastigado > 40} />
      </div>

      {/* Segunda fila — estadísticos */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:14 }}>
        {/* Censo */}
        <div style={{ background:"#060c1a", borderRadius:10, padding:"12px 14px" }}>
          <div style={{ fontSize:10, color:"#334155", fontWeight:700, letterSpacing:".05em", marginBottom:4 }}>CENSO POBLACIONAL</div>
          <div style={{ fontSize:16, fontWeight:900, color:"#e2e8f0" }}>{fmt(c.censo ?? 0)}</div>
          <div style={{ fontSize:10, color:"#4b6080" }}>votantes habilitados</div>
        </div>

        {/* Candidatos contrarios */}
        <div style={{ background:"#060c1a", borderRadius:10, padding:"12px 14px" }}>
          <div style={{ fontSize:10, color:"#334155", fontWeight:700, letterSpacing:".05em", marginBottom:4 }}>CANDIDATOS CONTRARIOS</div>
          {(c.contrarios ?? []).map((op, i) => (
            <div key={i} style={{ display:"flex", justifyContent:"space-between", marginBottom:2 }}>
              <span style={{ fontSize:10, color:"#64748b" }}>{op.nombre}</span>
              <span style={{ fontSize:10, fontWeight:700, color:"#ef4444" }}>{fmt(op.votos)}</span>
            </div>
          ))}
          <div style={{ borderTop:"1px solid #1e3a6e", marginTop:4, paddingTop:4, fontSize:10, fontWeight:700, color:"#ef4444" }}>
            Total: {fmt(totalContrarios)}
          </div>
        </div>

        {/* Cálculo real */}
        <div style={{ background:"#060c1a", borderRadius:10, padding:"12px 14px" }}>
          <div style={{ fontSize:10, color:"#334155", fontWeight:700, letterSpacing:".05em", marginBottom:4 }}>ANÁLISIS REAL</div>
          <div style={{ fontSize:11, color:"#64748b", marginBottom:3 }}>
            Votos disponibles: <span style={{ color:"#e2e8f0", fontWeight:700 }}>{fmt(disponibles)}</span>
          </div>
          <div style={{ fontSize:11, color:"#64748b", marginBottom:3 }}>
            Meta ajustada por castigo: <span style={{ color:"#f59e0b", fontWeight:700 }}>{fmt(metaAjustada)}</span>
          </div>
          <div style={{ fontSize:11, color: brechaRegistro > 0 ? "#ef4444" : "#10b981", fontWeight:700 }}>
            {brechaRegistro > 0
              ? `⚠ Faltan registrar: ${fmt(brechaRegistro)}`
              : "✓ Meta cubierta con margen"
            }
          </div>
        </div>
      </div>

      {/* Desglose líderes — barra de distribución */}
      <div style={{ display:"flex", height:6, borderRadius:4, overflow:"hidden", gap:1 }}>
        <div style={{ flex:confirmados, background:"#10b981" }}/>
        <div style={{ flex:pendientes,  background:"#f59e0b" }}/>
        <div style={{ flex:Math.max(sinContacto, 0), background:"#334155" }}/>
      </div>
      <div style={{ display:"flex", gap:16, marginTop:6 }}>
        {[["#10b981","Confirmados",confirmados],["#f59e0b","Pendientes",pendientes],["#334155","Sin contacto",Math.max(sinContacto,0)]].map(([col,lbl,val]) => (
          <div key={lbl} style={{ display:"flex", alignItems:"center", gap:5 }}>
            <span style={{ width:8, height:8, borderRadius:2, background:col, flexShrink:0 }}/>
            <span style={{ fontSize:10, color:"#4b6080" }}>{lbl}: <strong style={{ color:"#e2e8f0" }}>{val}</strong></span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Modal editar parámetros de campaña ───────────────────────
function ModalEditarCampaña({ candidato, onSave, onClose }) {
  const [form, setForm] = useState({
    meta:      candidato.meta      ?? 0,
    censo:     candidato.censo     ?? 0,
    contrarios: candidato.contrarios ?? [],
  });

  const setContrario = (i, field, value) => {
    const arr = [...form.contrarios];
    arr[i] = { ...arr[i], [field]: value };
    setForm(p => ({ ...p, contrarios: arr }));
  };
  const addContrario    = () => setForm(p => ({ ...p, contrarios: [...p.contrarios, { nombre:"", votos:0 }] }));
  const removeContrario = (i) => setForm(p => ({ ...p, contrarios: p.contrarios.filter((_,j) => j !== i) }));

  return (
    <div style={{ position:"fixed", inset:0, background:"#00000090", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <div style={{ background:"#0d1b3e", border:"1px solid #1e3a6e", borderRadius:18, width:480, maxHeight:"85vh", overflowY:"auto", padding:28 }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:20 }}>
          <h2 style={{ margin:0, fontSize:15, fontWeight:800, color:"#fff" }}>
            ✏️ {candidato.nombre}
          </h2>
          <button onClick={onClose} style={{ background:"none", border:"none", color:"#64748b", fontSize:20, cursor:"pointer" }}>✕</button>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <Field label="Votos requeridos (meta)">
            <input type="number" value={form.meta} onChange={e => setForm(p=>({...p, meta: +e.target.value}))} style={inpSt}/>
          </Field>
          <Field label="Censo poblacional (votantes habilitados)">
            <input type="number" value={form.censo} onChange={e => setForm(p=>({...p, censo: +e.target.value}))} style={inpSt}/>
          </Field>

          <div>
            <div style={{ fontSize:11, fontWeight:700, color:"#4b6080", marginBottom:8, letterSpacing:".05em" }}>
              CANDIDATOS CONTRARIOS
            </div>
            {form.contrarios.map((op, i) => (
              <div key={i} style={{ display:"flex", gap:8, marginBottom:8, alignItems:"center" }}>
                <input
                  value={op.nombre}
                  onChange={e => setContrario(i,"nombre",e.target.value)}
                  placeholder="Nombre candidato"
                  style={{ ...inpSt, flex:2 }}
                />
                <input
                  type="number"
                  value={op.votos}
                  onChange={e => setContrario(i,"votos",+e.target.value)}
                  placeholder="Votos"
                  style={{ ...inpSt, flex:1 }}
                />
                <button onClick={() => removeContrario(i)} style={{ background:"#ef444420", border:"1px solid #ef444455", borderRadius:7, padding:"7px 10px", color:"#ef4444", cursor:"pointer", fontSize:13 }}>✕</button>
              </div>
            ))}
            <button onClick={addContrario} style={{ background:"transparent", border:"1px dashed #1e3a6e", borderRadius:8, padding:"7px 14px", color:"#4b6080", cursor:"pointer", fontSize:12, width:"100%" }}>
              + Agregar contrario
            </button>
          </div>
        </div>

        <div style={{ display:"flex", gap:10, justifyContent:"flex-end", marginTop:20 }}>
          <BtnM ghost onClick={onClose}>Cancelar</BtnM>
          <BtnM onClick={() => { onSave({ ...candidato, ...form }); onClose(); }}>Guardar</BtnM>
        </div>
      </div>
    </div>
  );
}

// ─── Resumen Gobernador ────────────────────────────────────────
function ResumenGobernador({ gobernador, votantes, candidatos }) {
  const regGob  = votantes.filter(v => v.campañas?.includes("GOB")).length;
  const confGob = votantes.filter(v => v.estado?.["GOB"] === "confirmado").length;
  const castig  = regGob - confGob;
  const pctCast = pct(castig, regGob);
  const pctMeta = pct(confGob, gobernador.meta);
  const totalContrGlobal = candidatos.reduce((s,c) => s + (c.contrarios??[]).reduce((a,x)=>a+Number(x.votos||0),0), 0);

  return (
    <div style={{ background:"#0d1b3e", border:"1px solid #f59e0b33", borderRadius:16, padding:20, marginBottom:24 }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
        <div style={{ width:44, height:44, borderRadius:12, background:"#f59e0b22", border:"1px solid #f59e0b55", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>🏛️</div>
        <div>
          <div style={{ fontSize:16, fontWeight:900, color:"#fff" }}>{gobernador.nombre}</div>
          <div style={{ fontSize:11, color:"#4b6080" }}>Gobernador — Dpto. de Sucre</div>
        </div>
        <div style={{ marginLeft:"auto", textAlign:"right" }}>
          <div style={{ fontSize:22, fontWeight:900, color:"#f59e0b" }}>{pctMeta}%</div>
          <div style={{ fontSize:10, color:"#4b6080" }}>de meta global</div>
        </div>
      </div>

      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
        <Kpi label="Meta Gobernador"     value={fmt(gobernador.meta)} color="#f59e0b" />
        <Kpi label="Registrados"         value={fmt(regGob)}          color="#e2e8f0" />
        <Kpi label="Confirmados"         value={fmt(confGob)}         color="#10b981" />
        <Kpi label="% Castigados"        value={`${pctCast}%`}       color="#ef4444" warn={pctCast > 40} sub={`${fmt(castig)} votos`}/>
        <Kpi label="Candidatos activos"  value={candidatos.length}    color="#3b82f6" />
        <Kpi label="Líderes activos"     value="8"                    color="#f59e0b" />
      </div>
    </div>
  );
}

// ─── Vista principal ───────────────────────────────────────────
export default function DashboardMonitoreo() {
  const { gobernador, candidatos, votantes, updateCandidato } = useApp();
  const [editando, setEditando] = useState(null);
  const [filtro,   setFiltro]   = useState("all");

  const CARGO_OPTS = ["all", "Alcalde", "Concejal", "Asambleísta"];

  const candidatosFiltrados = filtro === "all"
    ? candidatos
    : candidatos.filter(c => c.cargo === filtro);

  return (
    <div>
      {/* Resumen Gobernador */}
      <ResumenGobernador gobernador={gobernador} votantes={votantes} candidatos={candidatos}/>

      {/* Filtro por tipo */}
      <div style={{ display:"flex", gap:8, marginBottom:20 }}>
        {CARGO_OPTS.map(op => (
          <button key={op} onClick={() => setFiltro(op)} style={{
            padding:"7px 16px", borderRadius:20, fontSize:12, fontWeight:700, cursor:"pointer",
            background: filtro === op ? "#2563eb" : "#0d1b3e",
            border: `1px solid ${filtro === op ? "#2563eb" : "#1e3a6e"}`,
            color: filtro === op ? "#fff" : "#4b6080",
          }}>
            {op === "all" ? "Todas las campañas" : op + "s"}
          </button>
        ))}
      </div>

      {/* Cards por candidato */}
      {candidatosFiltrados.map(c => (
        <CandidatoCard
          key={c.id}
          c={c}
          votantes={votantes}
          onEdit={setEditando}
        />
      ))}

      {/* Modal editar */}
      {editando && (
        <ModalEditarCampaña
          candidato={editando}
          onSave={updateCandidato}
          onClose={() => setEditando(null)}
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
function BtnM({ children, onClick, ghost }) {
  return (
    <button onClick={onClick} style={{
      padding:"9px 18px", borderRadius:9, fontSize:12, fontWeight:700, cursor:"pointer",
      background: ghost ? "transparent" : "#2563eb",
      border: ghost ? "1px solid #1e3a6e" : "none",
      color: ghost ? "#94a3b8" : "#fff",
    }}>{children}</button>
  );
}
const inpSt = {
  width:"100%", background:"#060c1a", border:"1px solid #1e3a6e", borderRadius:9,
  padding:"9px 12px", color:"#e2e8f0", fontSize:13, outline:"none", boxSizing:"border-box",
};
