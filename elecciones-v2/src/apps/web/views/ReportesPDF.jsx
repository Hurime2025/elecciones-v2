import { useState, useMemo } from "react";
import { useApp } from "../../../context/AppContext";
import {
  buildReportePorLider,
  buildReportePorPuesto,
  getPuestosUnicos,
  ESTADO_LABEL,
} from "../../../utils/reportesHelper";
import { generarPDFReporteLider, generarPDFReportePuesto } from "../../../utils/pdfGenerators";

// ─── Paleta compartida ─────────────────────────────────
const ESTADO_META = {
  confirmado:    { label:"Confirmado",   color:"#10b981", bg:"#10b98120" },
  pendiente:     { label:"Pendiente",    color:"#f59e0b", bg:"#f59e0b20" },
  no_contactado: { label:"Sin contacto", color:"#6b7280", bg:"#6b728020" },
  "—":           { label:"—",            color:"#475569", bg:"transparent" },
};

// ─── Primitivos UI ─────────────────────────────────────
const selectSt = {
  background:"#060c1a", border:"1px solid #1e3a6e", borderRadius:9,
  padding:"10px 14px", color:"#e2e8f0", fontSize:13, outline:"none",
  cursor:"pointer", width:"100%",
};

function Select({ label, value, onChange, children }) {
  return (
    <div>
      <div style={{ fontSize:10, fontWeight:700, color:"#4b6080", marginBottom:6, letterSpacing:".05em" }}>
        {label.toUpperCase()}
      </div>
      <select value={value} onChange={e => onChange(e.target.value)} style={selectSt}>
        {children}
      </select>
    </div>
  );
}

function KpiCard({ label, value, color }) {
  return (
    <div style={{ background:"#0d1b3e", border:"1px solid #1e3a6e", borderRadius:12, padding:"14px 18px", textAlign:"center" }}>
      <div style={{ fontSize:22, fontWeight:900, color }}>{value}</div>
      <div style={{ fontSize:10, color:"#4b6080", fontWeight:700, marginTop:3 }}>{label.toUpperCase()}</div>
    </div>
  );
}

function BarraProgreso({ pct }) {
  return (
    <div style={{ marginTop:4 }}>
      <div style={{ height:6, background:"#1e3a6e", borderRadius:3 }}>
        <div style={{ height:"100%", width:`${pct}%`, background:"linear-gradient(90deg,#10b981,#34d399)", borderRadius:3, transition:"width .5s" }}/>
      </div>
      <div style={{ fontSize:10, color:"#10b981", fontWeight:700, marginTop:4, textAlign:"right" }}>{pct}% confirmados</div>
    </div>
  );
}

// ─── Tipo selector ─────────────────────────────────────
function TipoBtn({ active, onClick, icon, title, desc }) {
  return (
    <button onClick={onClick} style={{
      flex:1, padding:"18px 16px", borderRadius:14, cursor:"pointer", textAlign:"left",
      background: active ? "#f59e0b18" : "#0d1b3e",
      border: `1.5px solid ${active ? "#f59e0b" : "#1e3a6e"}`,
      transition:"all .15s",
    }}>
      <div style={{ fontSize:24, marginBottom:6 }}>{icon}</div>
      <div style={{ fontSize:13, fontWeight:800, color: active ? "#f59e0b" : "#e2e8f0" }}>{title}</div>
      <div style={{ fontSize:11, color:"#4b6080", marginTop:3 }}>{desc}</div>
    </button>
  );
}

// ─── Tabla preview líder ───────────────────────────────
function TablaLider({ votantes }) {
  if (!votantes?.length) return (
    <div style={{ padding:"30px 0", textAlign:"center", color:"#4b6080", fontSize:13 }}>
      No hay votantes con los filtros seleccionados.
    </div>
  );
  return (
    <div style={{ overflowX:"auto" }}>
      <table style={{ width:"100%", borderCollapse:"collapse" }}>
        <thead>
          <tr style={{ background:"#060c1a" }}>
            {["Nombre","Cédula","Barrio","Puesto de Votación","Mesa","Estado"].map(h => (
              <th key={h} style={{ padding:"9px 12px", textAlign:"left", fontSize:9, fontWeight:700, color:"#4b6080", letterSpacing:".06em", whiteSpace:"nowrap" }}>
                {h.toUpperCase()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {votantes.map((v, i) => {
            const em = ESTADO_META[v.estado] ?? ESTADO_META["—"];
            return (
              <tr key={i} style={{ borderTop:"1px solid #1e3a6e14", background: i%2===0?"transparent":"#060c1a20" }}>
                <td style={{ padding:"9px 12px", fontSize:12, fontWeight:700, color:"#e2e8f0" }}>{v.nombre}</td>
                <td style={{ padding:"9px 12px", fontSize:11, color:"#94a3b8", fontFamily:"monospace" }}>{v.cedula}</td>
                <td style={{ padding:"9px 12px", fontSize:11, color:"#94a3b8" }}>{v.barrio}</td>
                <td style={{ padding:"9px 12px", fontSize:11, color:"#94a3b8" }}>{v.puesto}</td>
                <td style={{ padding:"9px 12px", fontSize:11, color:"#94a3b8" }}>{v.mesa}</td>
                <td style={{ padding:"9px 12px" }}>
                  <span style={{ background:em.bg, color:em.color, border:`1px solid ${em.color}44`, borderRadius:12, padding:"2px 10px", fontSize:10, fontWeight:700 }}>
                    {em.label}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── Tabla preview puesto ──────────────────────────────
function TablaPuesto({ mesas, campId }) {
  const [mesaOpen, setMesaOpen] = useState(null);
  if (!mesas?.length) return (
    <div style={{ padding:"30px 0", textAlign:"center", color:"#4b6080", fontSize:13 }}>No hay datos.</div>
  );
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      {mesas.map(m => (
        <div key={m.mesa} style={{ background:"#060c1a", border:"1px solid #1e3a6e", borderRadius:12, overflow:"hidden" }}>
          {/* Cabecera de mesa */}
          <div
            onClick={() => setMesaOpen(mesaOpen === m.mesa ? null : m.mesa)}
            style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 16px", cursor:"pointer" }}
          >
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <span style={{ fontSize:13, fontWeight:800, color:"#f59e0b" }}>🗳️ Mesa {m.mesa}</span>
              <span style={{ fontSize:11, color:"#64748b" }}>{m.total} votantes</span>
            </div>
            <div style={{ display:"flex", gap:12, alignItems:"center" }}>
              {campId !== "all" && (
                <>
                  <span style={{ fontSize:11, color:"#10b981", fontWeight:700 }}>✅ {m.confirmados}</span>
                  <span style={{ fontSize:11, color:"#f59e0b", fontWeight:700 }}>⏳ {m.pendientes}</span>
                  <span style={{ fontSize:11, color:"#6b7280", fontWeight:700 }}>📵 {m.sinContacto}</span>
                </>
              )}
              <span style={{ color:"#4b6080", fontSize:14 }}>{mesaOpen === m.mesa ? "▲" : "▼"}</span>
            </div>
          </div>
          {/* Detalle expandible */}
          {mesaOpen === m.mesa && (
            <div style={{ borderTop:"1px solid #1e3a6e" }}>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead>
                  <tr style={{ background:"#0d1b3e" }}>
                    {["Nombre","Cédula","Barrio","Estado"].map(h => (
                      <th key={h} style={{ padding:"7px 12px", fontSize:9, fontWeight:700, color:"#4b6080", textAlign:"left" }}>{h.toUpperCase()}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {m.votantes.map((v, i) => {
                    const em = ESTADO_META[v.estado] ?? ESTADO_META["—"];
                    return (
                      <tr key={i} style={{ borderTop:"1px solid #1e3a6e14" }}>
                        <td style={{ padding:"7px 12px", fontSize:12, color:"#e2e8f0" }}>{v.nombre}</td>
                        <td style={{ padding:"7px 12px", fontSize:11, color:"#94a3b8", fontFamily:"monospace" }}>{v.cedula}</td>
                        <td style={{ padding:"7px 12px", fontSize:11, color:"#94a3b8" }}>{v.barrio}</td>
                        <td style={{ padding:"7px 12px" }}>
                          {v.estado === "—"
                            ? <span style={{ color:"#475569", fontSize:11 }}>—</span>
                            : <span style={{ background:em.bg, color:em.color, border:`1px solid ${em.color}44`, borderRadius:12, padding:"2px 10px", fontSize:10, fontWeight:700 }}>{em.label}</span>
                          }
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// VISTA PRINCIPAL
// ═══════════════════════════════════════════════════════
export default function ReportesPDF() {
  const { votantes, lideres, candidatos, gobernador } = useApp();

  const [tipo,          setTipo]          = useState("lider");   // "lider" | "puesto"
  const [liderSel,      setLiderSel]      = useState(lideres[0]?.id ?? "");
  const [campSel,       setCampSel]       = useState("GOB");
  const [puestoSel,     setPuestoSel]     = useState("");
  const [campPuestoSel, setCampPuestoSel] = useState("GOB");
  const [generando,     setGenerando]     = useState(false);
  const [datos,         setDatos]         = useState(null);

  const ctx = { votantes, lideres, candidatos, gobernador };
  const puestos = useMemo(() => getPuestosUnicos(votantes), [votantes]);

  // Campaña "natural" del líder seleccionado
  const liderObj = lideres.find(l => l.id === liderSel);
  const campasLider = useMemo(() => {
    if (!liderObj) return [];
    const cands = candidatos.filter(c => c.id === liderObj.candidatoId);
    return [
      { id:"GOB", label:`${gobernador.nombre} (Gobernador)` },
      ...cands.map(c => ({ id: c.id, label:`${c.nombre} (${c.cargo})` })),
      ...candidatos.filter(c => c.id !== liderObj.candidatoId).map(c => ({ id:c.id, label:`${c.nombre} (${c.cargo})` })),
    ];
  }, [liderObj, candidatos, gobernador]);

  const campasAll = useMemo(() => [
    { id:"GOB",  label:`${gobernador.nombre} (Gobernador)` },
    ...candidatos.map(c => ({ id:c.id, label:`${c.nombre} (${c.cargo})` })),
  ], [candidatos, gobernador]);

  // Preview automático al cambiar parámetros
  const calcDatos = () => {
    if (tipo === "lider") {
      if (!liderSel) return null;
      return buildReportePorLider(liderSel, campSel, ctx);
    } else {
      if (!puestoSel) return null;
      return buildReportePorPuesto(puestoSel, campPuestoSel, ctx);
    }
  };

  // Recalcula preview al cambiar selección
  const preview = useMemo(() => {
    try { return calcDatos(); } catch { return null; }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipo, liderSel, campSel, puestoSel, campPuestoSel, votantes]);

  const handleDescargar = () => {
    if (!preview) return;
    setGenerando(true);
    setTimeout(() => {
      try {
        if (tipo === "lider") generarPDFReporteLider(preview);
        else                  generarPDFReportePuesto(preview);
      } catch(e) { console.error("Error PDF:", e); }
      setGenerando(false);
    }, 100);
  };

  const canDownload = !!preview && (tipo === "lider" ? !!liderSel : !!puestoSel);

  return (
    <div style={{ maxWidth:960, margin:"0 auto" }}>

      {/* ── Selector de tipo ── */}
      <div style={{ display:"flex", gap:12, marginBottom:24 }}>
        <TipoBtn active={tipo==="lider"}  onClick={()=>{ setTipo("lider");  setDatos(null); }}
          icon="🤝" title="Reporte por Líder"
          desc="Votantes asignados a un líder específico con sus estados por campaña" />
        <TipoBtn active={tipo==="puesto"} onClick={()=>{ setTipo("puesto"); setDatos(null); }}
          icon="🏫" title="Reporte por Puesto"
          desc="Votantes agrupados por mesa en un puesto de votación" />
      </div>

      {/* ── Parámetros ── */}
      <div style={{ background:"#0d1b3e", border:"1px solid #1e3a6e", borderRadius:14, padding:20, marginBottom:20 }}>
        <div style={{ fontSize:11, fontWeight:700, color:"#4b6080", marginBottom:14, letterSpacing:".06em" }}>
          📋 PARÁMETROS DEL REPORTE
        </div>

        {tipo === "lider" ? (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
            <Select label="Líder" value={liderSel} onChange={v => { setLiderSel(v); setCampSel("GOB"); }}>
              {lideres.map(l => (
                <option key={l.id} value={l.id}>{l.nombre} — {l.zona}</option>
              ))}
            </Select>
            <Select label="Campaña" value={campSel} onChange={setCampSel}>
              {campasLider.map(c => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </Select>
          </div>
        ) : (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
            <Select label="Puesto de votación" value={puestoSel} onChange={setPuestoSel}>
              <option value="">— Seleccionar puesto —</option>
              {puestos.map(p => <option key={p} value={p}>{p}</option>)}
            </Select>
            <Select label="Campaña (opcional)" value={campPuestoSel} onChange={setCampPuestoSel}>
              <option value="all">Todas las campañas</option>
              {campasAll.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </Select>
          </div>
        )}
      </div>

      {/* ── Preview ── */}
      {preview ? (
        <>
          {/* KPIs */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:16 }}>
            <KpiCard label="Total"        value={preview.resumen.totalVotantes ?? preview.resumen.total} color="#e2e8f0" />
            <KpiCard label="Confirmados"  value={preview.resumen.confirmados}  color="#10b981" />
            <KpiCard label="Pendientes"   value={preview.resumen.pendientes}   color="#f59e0b" />
            <KpiCard label="Sin contacto" value={preview.resumen.sinContacto}  color="#6b7280" />
          </div>
          {preview.resumen.pct !== undefined && (
            <div style={{ marginBottom:20 }}>
              <BarraProgreso pct={preview.resumen.pct} />
            </div>
          )}

          {/* Info líder / puesto */}
          <div style={{ background:"#0d1b3e", border:"1px solid #1e3a6e", borderRadius:14, padding:"14px 18px", marginBottom:16 }}>
            {tipo === "lider" && preview.lider ? (
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <div style={{ fontSize:15, fontWeight:800, color:"#fff" }}>{preview.lider.nombre}</div>
                  <div style={{ fontSize:11, color:"#64748b", marginTop:2 }}>{preview.lider.tipo === "urbano" ? "🏙️" : "🌿"} {preview.lider.zona} · 📱 {preview.lider.phone}</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:11, fontWeight:700, color:"#f59e0b" }}>CAMPAÑA</div>
                  <div style={{ fontSize:12, color:"#e2e8f0" }}>{preview.candidato?.nombre}</div>
                  <div style={{ fontSize:10, color:"#64748b" }}>{preview.candidato?.cargo}</div>
                </div>
              </div>
            ) : (
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <div style={{ fontSize:15, fontWeight:800, color:"#fff" }}>🏫 {preview.puesto}</div>
                  <div style={{ fontSize:11, color:"#64748b", marginTop:2 }}>{preview.resumen.totalMesas} mesas · {preview.resumen.totalVotantes} votantes</div>
                </div>
                {preview.candidato && (
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontSize:11, fontWeight:700, color:"#f59e0b" }}>CAMPAÑA</div>
                    <div style={{ fontSize:12, color:"#e2e8f0" }}>{preview.candidato.nombre}</div>
                    <div style={{ fontSize:10, color:"#64748b" }}>{preview.candidato.cargo}</div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Tabla */}
          <div style={{ background:"#0d1b3e", border:"1px solid #1e3a6e", borderRadius:14, overflow:"hidden", marginBottom:20 }}>
            <div style={{ padding:"12px 16px", borderBottom:"1px solid #1e3a6e", fontSize:11, fontWeight:700, color:"#4b6080" }}>
              VISTA PREVIA
            </div>
            <div style={{ padding:tipo==="puesto" ? 12 : 0 }}>
              {tipo === "lider"
                ? <TablaLider votantes={preview.votantes} />
                : <TablaPuesto mesas={preview.mesas} campId={preview.campId} />
              }
            </div>
          </div>

          {/* Botón descargar */}
          <div style={{ display:"flex", justifyContent:"flex-end", gap:10 }}>
            <div style={{ fontSize:11, color:"#4b6080", alignSelf:"center" }}>
              Generado: {preview.fecha}
            </div>
            <button
              onClick={handleDescargar}
              disabled={generando || !canDownload}
              style={{
                background: generando ? "#1e3a6e" : "linear-gradient(135deg,#f59e0b,#d97706)",
                border:"none", borderRadius:10, padding:"11px 28px",
                color: generando ? "#64748b" : "#000",
                fontSize:13, fontWeight:800, cursor: generando ? "not-allowed" : "pointer",
                display:"flex", alignItems:"center", gap:8,
              }}
            >
              {generando ? "⏳ Generando..." : "📥 Descargar PDF"}
            </button>
          </div>
        </>
      ) : (
        /* Estado vacío */
        <div style={{ background:"#0d1b3e", border:"1px solid #1e3a6e", borderRadius:14, padding:"50px 20px", textAlign:"center" }}>
          <div style={{ fontSize:40, marginBottom:12 }}>📄</div>
          <div style={{ fontSize:15, fontWeight:700, color:"#4b6080" }}>
            {tipo === "puesto" ? "Selecciona un puesto de votación" : "Selecciona un líder"}
          </div>
          <div style={{ fontSize:12, color:"#334155", marginTop:6 }}>
            Configura los parámetros arriba para generar el reporte
          </div>
        </div>
      )}
    </div>
  );
}
