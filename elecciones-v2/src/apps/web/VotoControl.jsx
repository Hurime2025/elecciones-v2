import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import GestionUsuarios from "./views/GestionUsuarios";
import GestionVotantes from "./views/GestionVotantes";
import DashboardMonitoreo from "./views/DashboardMonitoreo";

// ═══════════════════════════════════════════════════════════════
// DATA MODEL — Shared Voter Base + 3-Level Hierarchy
// ═══════════════════════════════════════════════════════════════

// LEVEL 1: Gobernador
const GOBERNADOR = {
  id: "GOB-1", nombre: "Eduardo Padilla Díaz", cargo: "Gobernador",
  depto: "Sucre", color: "#f59e0b", meta: 55000,
};

// LEVEL 2: Candidatos (each independent, share voter base)
const CANDIDATOS = [
  // Alcaldes
  { id: "C-01", nombre: "Carlos Martínez Ruiz",    cargo: "Alcalde",      municipio: "Sincelejo",  color: "#3b82f6", meta: 16000 },
  { id: "C-02", nombre: "Yenis Álvarez Torres",    cargo: "Alcalde",      municipio: "Corozal",    color: "#06b6d4", meta: 10000 },
  { id: "C-03", nombre: "Hernando Soto Luna",      cargo: "Alcalde",      municipio: "San Marcos", color: "#0ea5e9", meta: 7500  },
  // Concejales
  { id: "C-04", nombre: "Rosa Mendoza Pérez",      cargo: "Concejal",     municipio: "Sincelejo",  color: "#10b981", meta: 4000  },
  { id: "C-05", nombre: "Álvaro Díaz Herrera",     cargo: "Concejal",     municipio: "Sincelejo",  color: "#34d399", meta: 3500  },
  { id: "C-06", nombre: "Marta Salas Quintero",    cargo: "Concejal",     municipio: "Corozal",    color: "#6ee7b7", meta: 2200  },
  // Asambleístas
  { id: "C-07", nombre: "Jorge Ríos Castellanos",  cargo: "Asambleísta",  municipio: "Sucre",      color: "#a78bfa", meta: 6500  },
  { id: "C-08", nombre: "Lina Cure Montoya",       cargo: "Asambleísta",  municipio: "Sucre",      color: "#c4b5fd", meta: 5000  },
];

// LEVEL 3: Líderes (each tied to ONE candidato, manages own voters)
const LIDERES = [
  { id: "L-01", nombre: "Franklyn Torres",    tipo: "urbano", zona: "Com. 1 – Centro",         candidatoId: "C-01", phone: "3001234567" },
  { id: "L-02", nombre: "Esperanza Jiménez", tipo: "urbano", zona: "Com. 2 – Las Américas",   candidatoId: "C-01", phone: "3107654321" },
  { id: "L-03", nombre: "Reinaldo Pacheco",  tipo: "rural",  zona: "Vereda El Palmar",         candidatoId: "C-01", phone: "3204567890" },
  { id: "L-04", nombre: "Carmen Suárez",     tipo: "rural",  zona: "Vereda La Unión",          candidatoId: "C-02", phone: "3156789012" },
  { id: "L-05", nombre: "Julio César Reyes", tipo: "urbano", zona: "Com. 3 – Venecia",         candidatoId: "C-04", phone: "3008901234" },
  { id: "L-06", nombre: "Patricia Angarita", tipo: "rural",  zona: "Vereda San Pedro",         candidatoId: "C-07", phone: "3123456789" },
  { id: "L-07", nombre: "Deimer Herrera",    tipo: "urbano", zona: "Com. 4 – Villa Olímpica",  candidatoId: "C-01", phone: "3209871234" },
  { id: "L-08", nombre: "Nubia Cassiani",    tipo: "rural",  zona: "Vereda Palo Alto",         candidatoId: "C-03", phone: "3145678901" },
];

// SHARED VOTER BASE — votante can appear in multiple campaigns
const VOTANTES_BASE = [
  { id:"V-001", nombre:"María González",     cedula:"10234567", phone:"3001112233", barrio:"Centro",         puesto:"IE Simón Bolívar", mesa:"12", liderIds:["L-01"], campañas:["C-01","C-04","GOB"], estado:{"C-01":"confirmado","C-04":"pendiente","GOB":"confirmado"} },
  { id:"V-002", nombre:"Juan Rodríguez",     cedula:"10345678", phone:"3112223344", barrio:"Las Américas",   puesto:"IE Simón Bolívar", mesa:"07", liderIds:["L-02"], campañas:["C-01","GOB"],       estado:{"C-01":"pendiente","GOB":"pendiente"} },
  { id:"V-003", nombre:"Carmen Jiménez",     cedula:"10456789", phone:"3223334455", barrio:"Centro",         puesto:"IE La Esperanza",  mesa:"03", liderIds:["L-01"], campañas:["C-01","C-04","C-07","GOB"], estado:{"C-01":"confirmado","C-04":"confirmado","C-07":"pendiente","GOB":"confirmado"} },
  { id:"V-004", nombre:"Pedro Álvarez",      cedula:"10567890", phone:"3334445566", barrio:"Las Américas",   puesto:"IE Politécnico",   mesa:"21", liderIds:["L-02"], campañas:["C-01","GOB"],       estado:{"C-01":"no_contactado","GOB":"pendiente"} },
  { id:"V-005", nombre:"Rosa Martínez",      cedula:"10678901", phone:"3001234567", barrio:"Venecia",        puesto:"IE Simón Bolívar", mesa:"15", liderIds:["L-05","L-01"], campañas:["C-01","C-04","GOB"], estado:{"C-01":"confirmado","C-04":"confirmado","GOB":"confirmado"} },
  { id:"V-006", nombre:"Luis Hernández",     cedula:"10789012", phone:"3123456789", barrio:"El Palmar",      puesto:"IE Rural",         mesa:"02", liderIds:["L-03"], campañas:["C-01","GOB"],       estado:{"C-01":"confirmado","GOB":"confirmado"} },
  { id:"V-007", nombre:"Ana Pérez Díaz",     cedula:"10890123", phone:"3145678901", barrio:"La Unión",       puesto:"IE Corozal",       mesa:"08", liderIds:["L-04"], campañas:["C-02","C-06","GOB"], estado:{"C-02":"confirmado","C-06":"pendiente","GOB":"confirmado"} },
  { id:"V-008", nombre:"Jorge Herrera",      cedula:"10901234", phone:"3156789012", barrio:"San Pedro",      puesto:"IE Rural 2",       mesa:"01", liderIds:["L-06"], campañas:["C-07","GOB"],       estado:{"C-07":"confirmado","GOB":"confirmado"} },
  { id:"V-009", nombre:"Luz Marina Castro",  cedula:"11012345", phone:"3167890123", barrio:"Palo Alto",      puesto:"IE Rural 3",       mesa:"05", liderIds:["L-08"], campañas:["C-03","GOB"],       estado:{"C-03":"pendiente","GOB":"pendiente"} },
  { id:"V-010", nombre:"Iván Díaz Polo",     cedula:"11123456", phone:"3178901234", barrio:"Villa Olímpica", puesto:"IE Politécnico",   mesa:"18", liderIds:["L-07"], campañas:["C-01","C-04","GOB"], estado:{"C-01":"confirmado","C-04":"confirmado","GOB":"confirmado"} },
  { id:"V-011", nombre:"Sandra López",       cedula:"11234567", phone:"3189012345", barrio:"Centro",         puesto:"IE Simón Bolívar", mesa:"11", liderIds:["L-01","L-05"], campañas:["C-01","C-04","GOB"], estado:{"C-01":"confirmado","C-04":"no_contactado","GOB":"confirmado"} },
  { id:"V-012", nombre:"Carlos Ruiz Ortiz",  cedula:"11345678", phone:"3190123456", barrio:"Las Américas",   puesto:"IE La Esperanza",  mesa:"04", liderIds:["L-02"], campañas:["C-01","GOB"],       estado:{"C-01":"no_contactado","GOB":"no_contactado"} },
];

const NOVEDADES = [
  { id:1, liderId:"L-01", tipo:"cambio_opinion", votanteId:"V-004", msg:"Pedro Álvarez dudando de apoyar la candidatura",        fecha:"05 Mar 11:32", atendida:false },
  { id:2, liderId:"L-02", tipo:"traslado",        votanteId:null,    msg:"3 votantes de Las Américas se mudaron a Corozal",       fecha:"04 Mar 09:15", atendida:false },
  { id:3, liderId:"L-03", tipo:"fallecido",        votanteId:"V-006", msg:"Confirmado fallecimiento de Luis Hernández el 03 Mar", fecha:"03 Mar 16:48", atendida:true  },
  { id:4, liderId:"L-07", tipo:"nuevo_apoyo",      votanteId:null,    msg:"12 nuevos votantes en Villa Olímpica listos",          fecha:"05 Mar 08:05", atendida:false },
  { id:5, liderId:"L-04", tipo:"sin_transporte",   votanteId:null,    msg:"Vereda La Unión necesita transporte el día de elecciones", fecha:"04 Mar 14:22", atendida:false },
];

// ═══════════════════════════════════════════════════════════════
// UTILS
// ═══════════════════════════════════════════════════════════════
const pct  = (a,b) => b ? Math.round((a/b)*100) : 0;
const fmt  = n => n?.toLocaleString("es-CO") ?? "0";

const ESTADO_META = {
  confirmado:    { label:"Confirmado",    color:"#10b981", bg:"#10b98120" },
  pendiente:     { label:"Pendiente",     color:"#f59e0b", bg:"#f59e0b20" },
  no_contactado: { label:"Sin contacto",  color:"#6b7280", bg:"#6b728020" },
};

const NOVEDAD_META = {
  cambio_opinion: { icon:"⚠️", color:"#ef4444", label:"Cambio de opinión"  },
  traslado:       { icon:"🚚", color:"#f59e0b", label:"Traslado"           },
  fallecido:      { icon:"🕊️", color:"#6b7280", label:"Fallecido"          },
  nuevo_apoyo:    { icon:"🎉", color:"#10b981", label:"Nuevo apoyo"        },
  sin_transporte: { icon:"🚗", color:"#a78bfa", label:"Sin transporte"     },
};

const CARGO_COLOR = { Alcalde:"#3b82f6", Concejal:"#10b981", "Asambleísta":"#a78bfa" };

// ═══════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════

function Ring({ val, max, color, size=60 }) {
  const r = (size-10)/2, circ = 2*Math.PI*r;
  const fill = circ * Math.min(val/Math.max(max,1), 1);
  return (
    <svg width={size} height={size} style={{transform:"rotate(-90deg)"}}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1e3a6e" strokeWidth={6}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={6}
        strokeDasharray={`${fill} ${circ}`} strokeLinecap="round"/>
    </svg>
  );
}

function Tag({ label, color }) {
  return <span style={{ padding:"2px 8px", borderRadius:20, fontSize:10, fontWeight:700, background:`${color}20`, color, border:`1px solid ${color}40` }}>{label}</span>;
}

function Bar({ val, max, color, height=5 }) {
  return (
    <div style={{ height, background:"#1e3a6e", borderRadius:height, overflow:"hidden" }}>
      <div style={{ height:"100%", width:`${pct(val,max)}%`, background:color, borderRadius:height, transition:"width .5s" }}/>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// VIEWS
// ═══════════════════════════════════════════════════════════════

function ViewEstructura({ onOpenMsg }) {
  const [expanded, setExpanded] = useState(null);

  const grupos = [
    { key:"Alcalde",     label:"Alcaldes Municipales",       icon:"🏙️", color:"#3b82f6" },
    { key:"Concejal",    label:"Candidatos al Concejo",      icon:"🗂️", color:"#10b981" },
    { key:"Asambleísta", label:"Aspirantes a la Asamblea",   icon:"📜", color:"#a78bfa" },
  ];

  const statsFor = (cId) => {
    const vots = VOTANTES_BASE.filter(v => v.campañas.includes(cId));
    const conf = vots.filter(v => v.estado[cId] === "confirmado").length;
    const lids = LIDERES.filter(l => l.candidatoId === cId).length;
    return { total: vots.length, confirmados: conf, lideres: lids };
  };

  const totalGob = VOTANTES_BASE.length;
  const confGob  = VOTANTES_BASE.filter(v => v.campañas.includes("GOB") && v.estado["GOB"]==="confirmado").length;

  return (
    <div>
      {/* Gobernador Banner */}
      <div style={{ background:"linear-gradient(135deg,#1c1400 0%,#2e2000 100%)", border:"1px solid #f59e0b55", borderRadius:18, padding:"22px 28px", marginBottom:24, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:16 }}>
          <div style={{ width:54, height:54, borderRadius:14, background:"linear-gradient(135deg,#f59e0b,#b45309)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26 }}>🏛️</div>
          <div>
            <div style={{ fontSize:10, color:"#f59e0b", fontWeight:800, letterSpacing:".08em" }}>NIVEL 1 — GOBERNADOR · DPTO. DE SUCRE</div>
            <div style={{ fontSize:21, fontWeight:900, color:"#fff", letterSpacing:"-.5px" }}>{GOBERNADOR.nombre}</div>
            <div style={{ fontSize:11, color:"#64748b", marginTop:2 }}>Coordina {CANDIDATOS.length} candidatos · {LIDERES.length} líderes · Base compartida de {totalGob} votantes</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:20, alignItems:"center" }}>
          {[
            { v: fmt(totalGob),              l:"votantes base" },
            { v: fmt(confGob),               l:"confirmados",  c:"#10b981" },
            { v: `${pct(confGob,GOBERNADOR.meta)}%`, l:`meta ${fmt(GOBERNADOR.meta)}`, c:"#f59e0b" },
          ].map(s => (
            <div key={s.l} style={{ textAlign:"center" }}>
              <div style={{ fontSize:22, fontWeight:900, color:s.c||"#fff" }}>{s.v}</div>
              <div style={{ fontSize:9, color:"#475569", fontWeight:700 }}>{s.l.toUpperCase()}</div>
            </div>
          ))}
          <div style={{ position:"relative", width:56, height:56, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Ring val={confGob} max={GOBERNADOR.meta} color="#f59e0b" size={56}/>
            <div style={{ position:"absolute", fontSize:10, fontWeight:800, color:"#f59e0b" }}>{pct(confGob,GOBERNADOR.meta)}%</div>
          </div>
        </div>
        <button onClick={() => onOpenMsg({ nombre: GOBERNADOR.nombre, scope:"gob" })} style={{ background:"#f59e0b", border:"none", borderRadius:10, padding:"9px 18px", color:"#000", fontSize:12, fontWeight:800, cursor:"pointer" }}>
          💬 Difusión global
        </button>
      </div>

      {/* Connector line */}
      <div style={{ display:"flex", justifyContent:"center", marginBottom:8 }}>
        <div style={{ width:2, height:20, background:"linear-gradient(#f59e0b,#1e3a6e)" }}/>
      </div>

      {grupos.map(g => {
        const items = CANDIDATOS.filter(c => c.cargo === g.key);
        const gTotal = items.reduce((a,c) => { const s=statsFor(c.id); return a+s.total; }, 0);
        const gConf  = items.reduce((a,c) => { const s=statsFor(c.id); return a+s.confirmados; }, 0);
        const isOpen = expanded === g.key;
        return (
          <div key={g.key} style={{ marginBottom:16 }}>
            {/* Group header */}
            <div onClick={() => setExpanded(isOpen ? null : g.key)}
              style={{ display:"flex", alignItems:"center", justifyContent:"space-between", background:`${g.color}10`, border:`1px solid ${g.color}40`, borderRadius:14, padding:"14px 20px", cursor:"pointer", transition:"all .2s" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <span style={{ fontSize:20 }}>{g.icon}</span>
                <span style={{ fontSize:14, fontWeight:800, color:"#fff" }}>{g.label}</span>
                <Tag label={`${items.length} candidatos`} color={g.color}/>
                <span style={{ fontSize:10, color:"#475569" }}>NIVEL 2</span>
              </div>
              <div style={{ display:"flex", gap:20, alignItems:"center" }}>
                <div style={{ textAlign:"right" }}>
                  <span style={{ fontSize:13, fontWeight:700, color:"#e2e8f0" }}>{fmt(gTotal)}</span>
                  <span style={{ fontSize:10, color:"#475569", marginLeft:4 }}>votantes</span>
                </div>
                <div style={{ textAlign:"right" }}>
                  <span style={{ fontSize:13, fontWeight:700, color:"#10b981" }}>{fmt(gConf)}</span>
                  <span style={{ fontSize:10, color:"#475569", marginLeft:4 }}>confirmados</span>
                </div>
                <button onClick={e => { e.stopPropagation(); onOpenMsg({ nombre: g.label, scope:"grupo", color: g.color }); }}
                  style={{ background:`${g.color}20`, border:`1px solid ${g.color}40`, borderRadius:8, padding:"5px 12px", color:g.color, fontSize:11, fontWeight:700, cursor:"pointer" }}>
                  💬 Circular
                </button>
                <span style={{ color:"#475569", fontSize:14 }}>{isOpen ? "▲" : "▼"}</span>
              </div>
            </div>

            {/* Candidates */}
            {isOpen && (
              <div style={{ paddingLeft:24, marginTop:10, display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))", gap:12 }}>
                {items.map(c => {
                  const s = statsFor(c.id);
                  const lids = LIDERES.filter(l => l.candidatoId === c.id);
                  return (
                    <div key={c.id} style={{ background:"#0d1b3e", border:`1.5px solid ${c.color}50`, borderRadius:14, padding:18 }}>
                      {/* connector */}
                      <div style={{ fontSize:9, color:c.color, fontWeight:800, marginBottom:6, letterSpacing:".05em" }}>
                        NIVEL 2 · {c.cargo.toUpperCase()} · {c.municipio}
                      </div>
                      <div style={{ fontSize:14, fontWeight:800, color:"#fff", marginBottom:10 }}>{c.nombre}</div>

                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:6, marginBottom:12 }}>
                        {[
                          { v:fmt(s.total),        l:"votantes",    c:"#e2e8f0" },
                          { v:fmt(s.confirmados),  l:"confirmados", c:"#10b981" },
                          { v:s.lideres,           l:"líderes",     c:c.color   },
                        ].map(k => (
                          <div key={k.l} style={{ background:"#080d1c", borderRadius:8, padding:"8px 0", textAlign:"center" }}>
                            <div style={{ fontSize:17, fontWeight:800, color:k.c }}>{k.v}</div>
                            <div style={{ fontSize:8, color:"#475569", fontWeight:700 }}>{k.l.toUpperCase()}</div>
                          </div>
                        ))}
                      </div>

                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                        <span style={{ fontSize:10, color:"#475569" }}>Avance meta ({fmt(c.meta)})</span>
                        <span style={{ fontSize:10, color:c.color, fontWeight:700 }}>{pct(s.confirmados,c.meta)}%</span>
                      </div>
                      <Bar val={s.confirmados} max={c.meta} color={c.color}/>

                      {/* NIVEL 3: Líderes */}
                      {lids.length > 0 && (
                        <div style={{ marginTop:12, paddingTop:12, borderTop:"1px solid #1e3a6e" }}>
                          <div style={{ fontSize:9, color:"#475569", fontWeight:700, marginBottom:6 }}>NIVEL 3 — LÍDERES</div>
                          <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                            {lids.map(l => {
                              const lVots = VOTANTES_BASE.filter(v => v.liderIds.includes(l.id) && v.campañas.includes(c.id));
                              const lConf = lVots.filter(v => v.estado[c.id]==="confirmado").length;
                              return (
                                <div key={l.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", background:"#0a1220", borderRadius:8, padding:"7px 10px" }}>
                                  <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                                    <span style={{ fontSize:12 }}>{l.tipo==="urbano"?"🏙️":"🌿"}</span>
                                    <div>
                                      <div style={{ fontSize:11, color:"#cbd5e1", fontWeight:600 }}>{l.nombre}</div>
                                      <div style={{ fontSize:9, color:"#475569" }}>{l.zona}</div>
                                    </div>
                                  </div>
                                  <div style={{ textAlign:"right" }}>
                                    <div style={{ fontSize:11, fontWeight:700, color:"#10b981" }}>{lConf}<span style={{ color:"#475569", fontWeight:400 }}>/{lVots.length}</span></div>
                                    <div style={{ fontSize:8, color:"#475569" }}>conf/asig</div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      <button onClick={() => onOpenMsg({ nombre: c.nombre, scope:"candidato", cId: c.id, color: c.color })}
                        style={{ width:"100%", marginTop:12, background:`${c.color}18`, border:`1px solid ${c.color}44`, borderRadius:9, padding:"8px", color:c.color, fontSize:11, fontWeight:700, cursor:"pointer" }}>
                        💬 Mensajería campaña
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
function ViewVotantes({ onOpenMsg }) {
  const [campFilter, setCampFilter]     = useState("all");
  const [estadoFilter, setEstadoFilter] = useState("all");
  const [liderFilter, setLiderFilter]   = useState("all");
  const [search, setSearch]             = useState("");
  const [selected, setSelected]         = useState([]);

  const voterList = useMemo(() => {
    return VOTANTES_BASE.filter(v => {
      if (campFilter !== "all" && !v.campañas.includes(campFilter)) return false;
      if (estadoFilter !== "all" && campFilter !== "all" && v.estado[campFilter] !== estadoFilter) return false;
      if (liderFilter !== "all" && !v.liderIds.includes(liderFilter)) return false;
      if (search && !v.nombre.toLowerCase().includes(search.toLowerCase()) &&
          !v.cedula.includes(search) && !v.barrio.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [campFilter, estadoFilter, liderFilter, search]);

  const toggle = id => setSelected(p => p.includes(id) ? p.filter(x=>x!==id) : [...p,id]);
  const allSel = voterList.length > 0 && voterList.every(v => selected.includes(v.id));

  return (
    <div>
      {/* Filters */}
      <div style={{ display:"flex", gap:10, marginBottom:18, flexWrap:"wrap", alignItems:"center" }}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Nombre, cédula, barrio..."
          style={{ background:"#0d1b3e", border:"1px solid #1e3a6e", borderRadius:10, padding:"8px 14px", color:"#e2e8f0", fontSize:12, outline:"none", width:220 }}/>
        
        <select value={campFilter} onChange={e=>setCampFilter(e.target.value)}
          style={{ background:"#0d1b3e", border:"1px solid #1e3a6e", borderRadius:10, padding:"8px 12px", color:"#94a3b8", fontSize:12, outline:"none" }}>
          <option value="all">Todas las campañas</option>
          <option value="GOB">Gobernación</option>
          {CANDIDATOS.map(c => <option key={c.id} value={c.id}>{c.cargo} — {c.nombre.split(" ")[0]} {c.nombre.split(" ")[1]}</option>)}
        </select>

        <select value={liderFilter} onChange={e=>setLiderFilter(e.target.value)}
          style={{ background:"#0d1b3e", border:"1px solid #1e3a6e", borderRadius:10, padding:"8px 12px", color:"#94a3b8", fontSize:12, outline:"none" }}>
          <option value="all">Todos los líderes</option>
          {LIDERES.map(l => <option key={l.id} value={l.id}>{l.nombre} ({l.zona})</option>)}
        </select>

        {campFilter !== "all" && (
          <select value={estadoFilter} onChange={e=>setEstadoFilter(e.target.value)}
            style={{ background:"#0d1b3e", border:"1px solid #1e3a6e", borderRadius:10, padding:"8px 12px", color:"#94a3b8", fontSize:12, outline:"none" }}>
            <option value="all">Todos los estados</option>
            <option value="confirmado">Confirmado</option>
            <option value="pendiente">Pendiente</option>
            <option value="no_contactado">Sin contacto</option>
          </select>
        )}

        <div style={{ marginLeft:"auto", display:"flex", gap:8, alignItems:"center" }}>
          <span style={{ fontSize:12, color:"#475569" }}>{voterList.length} votantes</span>
          {selected.length > 0 && (
            <button onClick={() => onOpenMsg({ nombre:`${selected.length} votantes seleccionados`, scope:"seleccion", ids:selected })}
              style={{ background:"#25d36622", border:"1px solid #25d36644", borderRadius:9, padding:"7px 14px", color:"#25d366", fontSize:12, fontWeight:700, cursor:"pointer" }}>
              💬 Enviar a {selected.length}
            </button>
          )}
        </div>
      </div>

      {/* Shared voter note */}
      <div style={{ background:"#0ea5e910", border:"1px solid #0ea5e930", borderRadius:10, padding:"10px 16px", marginBottom:14, fontSize:11, color:"#7dd3fc" }}>
        ℹ️ La base de votantes es <strong style={{color:"#fff"}}>compartida</strong>: un mismo votante puede aparecer en múltiples campañas con estados independientes.
      </div>

      {/* Table */}
      <div style={{ background:"#0d1b3e", border:"1px solid #1e3a6e", borderRadius:14, overflow:"hidden" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ background:"#07101f" }}>
              <th style={{ padding:"11px 14px", textAlign:"left" }}>
                <input type="checkbox" checked={allSel} onChange={e => setSelected(e.target.checked ? voterList.map(v=>v.id) : [])} style={{ accentColor:"#f59e0b" }}/>
              </th>
              {["Votante","Cédula","Puesto / Mesa","Líder","Campañas",""].map(h=>(
                <th key={h} style={{ padding:"11px 14px", textAlign:"left", fontSize:10, color:"#475569", fontWeight:700, letterSpacing:".05em" }}>{h.toUpperCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {voterList.map((v,i) => {
              const lider = LIDERES.find(l => v.liderIds.includes(l.id));
              return (
                <tr key={v.id} style={{ borderTop:"1px solid #1e3a6e", background: i%2===0?"transparent":"#080d1c" }}>
                  <td style={{ padding:"10px 14px" }}>
                    <input type="checkbox" checked={selected.includes(v.id)} onChange={()=>toggle(v.id)} style={{ accentColor:"#f59e0b" }}/>
                  </td>
                  <td style={{ padding:"10px 14px" }}>
                    <div style={{ fontWeight:600, fontSize:13, color:"#e2e8f0" }}>{v.nombre}</div>
                    <div style={{ fontSize:10, color:"#475569" }}>{v.barrio}</div>
                  </td>
                  <td style={{ padding:"10px 14px", fontSize:11, color:"#94a3b8" }}>{v.cedula}</td>
                  <td style={{ padding:"10px 14px" }}>
                    <div style={{ fontSize:11, color:"#e2e8f0" }}>{v.puesto}</div>
                    <div style={{ fontSize:10, color:"#475569" }}>Mesa {v.mesa}</div>
                  </td>
                  <td style={{ padding:"10px 14px" }}>
                    {lider && (
                      <div>
                        <div style={{ fontSize:11, color:"#e2e8f0" }}>{lider.nombre}</div>
                        <Tag label={lider.tipo==="urbano"?"🏙️ Urbano":"🌿 Rural"} color={lider.tipo==="urbano"?"#0ea5e9":"#10b981"}/>
                      </div>
                    )}
                  </td>
                  <td style={{ padding:"10px 14px" }}>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
                      {v.campañas.map(cId => {
                        const cand = cId==="GOB" ? GOBERNADOR : CANDIDATOS.find(c=>c.id===cId);
                        const est  = v.estado[cId];
                        const ec   = ESTADO_META[est];
                        return cand ? (
                          <span key={cId} style={{ padding:"2px 7px", borderRadius:20, fontSize:9, fontWeight:700,
                            background: ec?.bg||"#1e3a6e", color: ec?.color||"#94a3b8",
                            border:`1px solid ${ec?.color||"#1e3a6e"}40`,
                            whiteSpace:"nowrap"
                          }}>
                            {cId==="GOB" ? "Gob" : cand.cargo?.slice(0,3)} · {ec?.label?.slice(0,4)||"—"}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </td>
                  <td style={{ padding:"10px 14px" }}>
                    <button onClick={() => onOpenMsg({ nombre:v.nombre, scope:"individual", ids:[v.id] })}
                      style={{ background:"#25d36618", border:"1px solid #25d36640", borderRadius:7, padding:"5px 10px", color:"#25d366", fontSize:10, fontWeight:700, cursor:"pointer" }}>
                      💬
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
function ViewLideres({ onOpenMsg }) {
  const [tipoFilter, setTipoFilter] = useState("all");
  const [candFilter, setCandFilter] = useState("all");
  const [drill, setDrill]           = useState(null);

  const list = LIDERES.filter(l => {
    if (tipoFilter !== "all" && l.tipo !== tipoFilter) return false;
    if (candFilter !== "all" && l.candidatoId !== candFilter) return false;
    return true;
  });

  return (
    <div>
      <div style={{ display:"flex", gap:10, marginBottom:18, flexWrap:"wrap", alignItems:"center" }}>
        <div style={{ display:"flex", gap:6 }}>
          {[{v:"all",l:"Todos"},{v:"urbano",l:"🏙️ Urbano"},{v:"rural",l:"🌿 Rural"}].map(f=>(
            <button key={f.v} onClick={()=>setTipoFilter(f.v)}
              style={{ padding:"7px 14px", borderRadius:20, fontSize:11, fontWeight:700, cursor:"pointer",
                background: tipoFilter===f.v ? "#f59e0b22" : "#0d1b3e",
                border: `1px solid ${tipoFilter===f.v ? "#f59e0b66" : "#1e3a6e"}`,
                color: tipoFilter===f.v ? "#f59e0b" : "#64748b",
              }}>{f.l}</button>
          ))}
        </div>
        <select value={candFilter} onChange={e=>setCandFilter(e.target.value)}
          style={{ background:"#0d1b3e", border:"1px solid #1e3a6e", borderRadius:10, padding:"7px 12px", color:"#94a3b8", fontSize:12, outline:"none" }}>
          <option value="all">Todos los candidatos</option>
          {CANDIDATOS.map(c=><option key={c.id} value={c.id}>{c.cargo} — {c.nombre.split(" ")[0]}</option>)}
        </select>
        <button onClick={()=>onOpenMsg({nombre:"TODOS LOS LÍDERES",scope:"lideres"})} style={{ marginLeft:"auto", background:"#f59e0b22", border:"1px solid #f59e0b44", borderRadius:9, padding:"7px 14px", color:"#f59e0b", fontSize:12, fontWeight:700, cursor:"pointer" }}>
          💬 Circular a líderes
        </button>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:14 }}>
        {list.map(l => {
          const cand     = CANDIDATOS.find(c=>c.id===l.candidatoId);
          const misVots  = VOTANTES_BASE.filter(v=>v.liderIds.includes(l.id)&&v.campañas.includes(l.candidatoId));
          const conf     = misVots.filter(v=>v.estado[l.candidatoId]==="confirmado").length;
          const pend     = misVots.filter(v=>v.estado[l.candidatoId]==="pendiente").length;
          const noContact= misVots.filter(v=>v.estado[l.candidatoId]==="no_contactado").length;
          const isOpen   = drill===l.id;
          const novsCount = NOVEDADES.filter(n=>n.liderId===l.id&&!n.atendida).length;

          return (
            <div key={l.id} onClick={()=>setDrill(isOpen?null:l.id)}
              style={{ background:"#0d1b3e", border:`1.5px solid ${isOpen?(cand?.color||"#f59e0b"):"#1e3a6e"}`, borderRadius:14, padding:18, cursor:"pointer", transition:"border-color .2s" }}>
              
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
                <div>
                  <div style={{ fontSize:13, fontWeight:800, color:"#fff" }}>{l.nombre}</div>
                  <div style={{ fontSize:10, color:"#64748b", marginTop:2 }}>{l.zona}</div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:4, alignItems:"flex-end" }}>
                  <Tag label={l.tipo==="urbano"?"🏙️ Urbano":"🌿 Rural"} color={l.tipo==="urbano"?"#0ea5e9":"#10b981"}/>
                  {cand && <Tag label={`${cand.cargo} · ${cand.municipio}`} color={cand.color}/>}
                  {novsCount > 0 && <Tag label={`${novsCount} novedades`} color="#ef4444"/>}
                </div>
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:6, marginBottom:10 }}>
                {[{v:conf,l:"confirmados",c:"#10b981"},{v:pend,l:"pendientes",c:"#f59e0b"},{v:noContact,l:"sin contacto",c:"#6b7280"}].map(k=>(
                  <div key={k.l} style={{ background:"#080d1c", borderRadius:7, padding:"7px 0", textAlign:"center" }}>
                    <div style={{ fontSize:18, fontWeight:800, color:k.c }}>{k.v}</div>
                    <div style={{ fontSize:8, color:"#475569", fontWeight:700 }}>{k.l.toUpperCase()}</div>
                  </div>
                ))}
              </div>

              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                <span style={{ fontSize:9, color:"#475569" }}>Efectividad líder</span>
                <span style={{ fontSize:9, fontWeight:700, color:"#10b981" }}>{pct(conf,misVots.length)}%</span>
              </div>
              <Bar val={conf} max={misVots.length} color={cand?.color||"#10b981"}/>

              {isOpen && (
                <div style={{ marginTop:14, paddingTop:14, borderTop:"1px solid #1e3a6e" }}>
                  <div style={{ fontSize:10, color:"#475569", marginBottom:10 }}>📞 {l.phone} · NIVEL 3</div>

                  {/* Voters of this leader */}
                  <div style={{ fontSize:9, color:"#64748b", fontWeight:700, marginBottom:6 }}>SUS VOTANTES ASIGNADOS</div>
                  <div style={{ display:"flex", flexDirection:"column", gap:5, marginBottom:12, maxHeight:140, overflowY:"auto" }}>
                    {misVots.map(v => {
                      const est = v.estado[l.candidatoId];
                      return (
                        <div key={v.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", background:"#0a1220", borderRadius:7, padding:"6px 10px" }}>
                          <div>
                            <span style={{ fontSize:11, color:"#cbd5e1", fontWeight:600 }}>{v.nombre}</span>
                            <span style={{ fontSize:9, color:"#475569", marginLeft:6 }}>Mesa {v.mesa}</span>
                          </div>
                          <Tag label={ESTADO_META[est]?.label||est} color={ESTADO_META[est]?.color||"#64748b"}/>
                        </div>
                      );
                    })}
                  </div>

                  <div style={{ display:"flex", gap:8 }}>
                    <button onClick={e=>{e.stopPropagation();onOpenMsg({nombre:l.nombre,scope:"lider",lId:l.id,canal:"whatsapp"})}}
                      style={{ flex:1, background:"#25d36618", border:"1px solid #25d36640", borderRadius:8, padding:"8px", color:"#25d366", fontSize:11, fontWeight:700, cursor:"pointer" }}>
                      💬 WhatsApp
                    </button>
                    <button onClick={e=>{e.stopPropagation();onOpenMsg({nombre:l.nombre,scope:"lider",lId:l.id,canal:"sms"})}}
                      style={{ flex:1, background:"#0ea5e918", border:"1px solid #0ea5e940", borderRadius:8, padding:"8px", color:"#0ea5e9", fontSize:11, fontWeight:700, cursor:"pointer" }}>
                      📱 SMS
                    </button>
                    <button onClick={e=>{e.stopPropagation();onOpenMsg({nombre:`Votantes de ${l.nombre}`,scope:"lider_votantes",lId:l.id})}}
                      style={{ flex:1, background:"#a78bfa18", border:"1px solid #a78bfa40", borderRadius:8, padding:"8px", color:"#a78bfa", fontSize:11, fontWeight:700, cursor:"pointer" }}>
                      📣 A sus votantes
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
function ViewNovedades() {
  const [filter, setFilter] = useState("all");

  const list = NOVEDADES.filter(n => filter==="all" || (filter==="pendientes"&&!n.atendida) || (filter==="atendidas"&&n.atendida));

  return (
    <div>
      <div style={{ display:"flex", gap:8, marginBottom:18 }}>
        {[{v:"all",l:"Todas"},{v:"pendientes",l:`⚡ Pendientes (${NOVEDADES.filter(n=>!n.atendida).length})`},{v:"atendidas",l:"✅ Atendidas"}].map(f=>(
          <button key={f.v} onClick={()=>setFilter(f.v)}
            style={{ padding:"7px 16px", borderRadius:20, fontSize:12, fontWeight:700, cursor:"pointer",
              background:filter===f.v?"#ef444420":"#0d1b3e",
              border:`1px solid ${filter===f.v?"#ef444460":"#1e3a6e"}`,
              color:filter===f.v?"#ef4444":"#64748b",
            }}>{f.l}</button>
        ))}
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {list.map(n => {
          const meta  = NOVEDAD_META[n.tipo];
          const lider = LIDERES.find(l=>l.id===n.liderId);
          const vot   = n.votanteId ? VOTANTES_BASE.find(v=>v.id===n.votanteId) : null;
          return (
            <div key={n.id} style={{ background:"#0d1b3e", border:`1px solid ${n.atendida?"#1e3a6e":meta.color+"55"}`, borderRadius:14, padding:"16px 20px", display:"flex", alignItems:"center", gap:14 }}>
              <span style={{ fontSize:26 }}>{meta.icon}</span>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", gap:8, marginBottom:4 }}>
                  <Tag label={meta.label} color={meta.color}/>
                  <Tag label={lider?.nombre||"—"} color="#f59e0b"/>
                  <Tag label={lider?.tipo==="urbano"?"Urbano":"Rural"} color={lider?.tipo==="urbano"?"#0ea5e9":"#10b981"}/>
                  {vot && <Tag label={vot.nombre} color="#94a3b8"/>}
                </div>
                <div style={{ fontSize:13, color:"#e2e8f0", fontWeight:600 }}>{n.msg}</div>
                <div style={{ fontSize:10, color:"#475569", marginTop:2 }}>🕐 {n.fecha} · {lider?.zona}</div>
              </div>
              <div style={{ textAlign:"center" }}>
                {n.atendida
                  ? <Tag label="Atendida" color="#10b981"/>
                  : <Tag label="NUEVA" color="#ef4444"/>
                }
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop:20, background:"#0d1b3e", border:"1px dashed #1e3a6e", borderRadius:14, padding:20, textAlign:"center" }}>
        <div style={{ fontSize:24, marginBottom:8 }}>📲</div>
        <div style={{ color:"#94a3b8", fontSize:13, fontWeight:600 }}>Los líderes reportan desde su app móvil</div>
        <div style={{ display:"flex", gap:8, justifyContent:"center", marginTop:12, flexWrap:"wrap" }}>
          {Object.entries(NOVEDAD_META).map(([k,v]) => (
            <Tag key={k} label={`${v.icon} ${v.label}`} color={v.color}/>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
function ViewMensajeria({ onOpenMsg }) {
  return (
    <div>
      {/* Niveles de difusión */}
      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:11, color:"#64748b", fontWeight:700, marginBottom:12, letterSpacing:".06em" }}>NIVELES DE DIFUSIÓN</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
          {[
            { label:"Nivel 1 — Global",      desc:"Todos los votantes de la red del Gobernador",                            color:"#f59e0b", icon:"📡", count:`${VOTANTES_BASE.length} votantes` },
            { label:"Nivel 2 — Por Candidato",desc:"Votantes registrados a un candidato específico",                        color:"#3b82f6", icon:"🎯", count:`${CANDIDATOS.length} candidatos` },
            { label:"Nivel 3 — Por Líder",    desc:"Solo los votantes asignados a un líder urbano o rural",                 color:"#10b981", icon:"👤", count:`${LIDERES.length} líderes` },
          ].map(s=>(
            <div key={s.label} onClick={()=>onOpenMsg({nombre:s.label, scope:"segmento", color:s.color})}
              style={{ background:"#0d1b3e", border:`1px solid ${s.color}40`, borderRadius:14, padding:20, cursor:"pointer", transition:"all .2s" }}>
              <div style={{ fontSize:28, marginBottom:10 }}>{s.icon}</div>
              <div style={{ fontSize:13, fontWeight:800, color:"#fff", marginBottom:4 }}>{s.label}</div>
              <div style={{ fontSize:11, color:"#64748b", marginBottom:14 }}>{s.desc}</div>
              <Tag label={s.count} color={s.color}/>
            </div>
          ))}
        </div>
      </div>

      {/* Canales */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        {[
          { canal:"WhatsApp", icon:"💬", color:"#25d366", features:["Texto + multimedia","Flyers de campaña","Audio del candidato","Variables {{nombre}} {{puesto}} {{mesa}}","Programación de envíos"] },
          { canal:"SMS",      icon:"📱", color:"#0ea5e9", features:["Funciona sin internet","Mayor alcance zonas rurales","160 caracteres","Variables {{nombre}} {{puesto}}","Recordatorio día E"] },
        ].map(ch=>(
          <div key={ch.canal} style={{ background:"#0d1b3e", border:`1px solid ${ch.color}33`, borderRadius:14, padding:20 }}>
            <div style={{ fontSize:30, marginBottom:10 }}>{ch.icon}</div>
            <div style={{ fontSize:15, fontWeight:800, color:"#fff", marginBottom:12 }}>{ch.canal} Masivo</div>
            <div style={{ display:"flex", flexDirection:"column", gap:6, marginBottom:18 }}>
              {ch.features.map(f=>(
                <div key={f} style={{ display:"flex", gap:7, alignItems:"center" }}>
                  <span style={{ color:ch.color, fontSize:8 }}>●</span>
                  <span style={{ fontSize:11, color:"#94a3b8" }}>{f}</span>
                </div>
              ))}
            </div>
            <button onClick={()=>onOpenMsg({nombre:ch.canal, scope:"canal", canal:ch.canal.toLowerCase(), color:ch.color})}
              style={{ width:"100%", background:ch.color, border:"none", borderRadius:10, padding:"10px", color:"#000", fontSize:13, fontWeight:800, cursor:"pointer" }}>
              Crear campaña {ch.canal}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MODAL MENSAJE
// ═══════════════════════════════════════════════════════════════
function ModalMensaje({ target, onClose }) {
  const [canal,    setCanal]    = useState(target.canal || "whatsapp");
  const [segmento, setSegmento] = useState("all");
  const [texto,    setTexto]    = useState("");
  const [sent,     setSent]     = useState(false);

  const send = () => { setSent(true); setTimeout(() => { setSent(false); onClose(); }, 2400); };

  const canalColor = canal === "whatsapp" ? "#25d366" : "#0ea5e9";
  const canalIcon  = canal === "whatsapp" ? "💬" : "📱";

  return (
    <div style={{ position:"fixed", inset:0, background:"#000d", display:"flex", alignItems:"center", justifyContent:"center", zIndex:400 }}>
      <div style={{ background:"#0b1628", border:"1px solid #1e3a6e", borderRadius:22, padding:32, width:540, maxWidth:"93vw", boxShadow:"0 24px 80px #000a" }}>
        {sent ? (
          <div style={{ textAlign:"center", padding:"32px 0" }}>
            <div style={{ fontSize:52, marginBottom:14 }}>✅</div>
            <div style={{ fontSize:20, fontWeight:900, color:"#10b981" }}>¡En camino!</div>
            <div style={{ fontSize:13, color:"#64748b", marginTop:6 }}>Procesando envíos masivos...</div>
          </div>
        ) : (
          <>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:20 }}>
              <div>
                <div style={{ fontSize:16, fontWeight:900, color:"#fff" }}>Nuevo mensaje</div>
                <div style={{ fontSize:11, color:"#475569", marginTop:2 }}>Para: <span style={{ color:"#e2e8f0" }}>{target.nombre}</span></div>
              </div>
              <button onClick={onClose} style={{ background:"none", border:"none", color:"#475569", fontSize:22, cursor:"pointer" }}>✕</button>
            </div>

            {/* Canal */}
            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:10, color:"#475569", fontWeight:700, marginBottom:6 }}>CANAL</div>
              <div style={{ display:"flex", gap:8 }}>
                {[{k:"whatsapp",l:"💬 WhatsApp",c:"#25d366"},{k:"sms",l:"📱 SMS",c:"#0ea5e9"}].map(ch=>(
                  <button key={ch.k} onClick={()=>setCanal(ch.k)}
                    style={{ flex:1, padding:"9px", borderRadius:10, cursor:"pointer",
                      background: canal===ch.k ? `${ch.c}22` : "#07101f",
                      border: `1.5px solid ${canal===ch.k ? ch.c+"88" : "#1e3a6e"}`,
                      color: canal===ch.k ? ch.c : "#4b6080",
                      fontSize:12, fontWeight:700,
                    }}>{ch.l}</button>
                ))}
              </div>
            </div>

            {/* Segmento */}
            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:10, color:"#475569", fontWeight:700, marginBottom:6 }}>DESTINATARIOS</div>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {[{v:"all",l:"Todos"},{v:"confirmado",l:"✅ Confirmados"},{v:"pendiente",l:"⏳ Pendientes"},{v:"no_contactado",l:"📵 Sin contacto"},{v:"lider",l:"👥 Solo líderes"}].map(s=>(
                  <button key={s.v} onClick={()=>setSegmento(s.v)}
                    style={{ padding:"5px 12px", borderRadius:20, fontSize:11, fontWeight:700, cursor:"pointer",
                      background: segmento===s.v ? `${canalColor}20` : "#07101f",
                      border: `1px solid ${segmento===s.v ? canalColor+"66" : "#1e3a6e"}`,
                      color: segmento===s.v ? canalColor : "#475569",
                    }}>{s.l}</button>
                ))}
              </div>
            </div>

            {/* Adjuntos WhatsApp */}
            {canal === "whatsapp" && (
              <div style={{ marginBottom:16 }}>
                <div style={{ fontSize:10, color:"#475569", fontWeight:700, marginBottom:6 }}>ADJUNTAR</div>
                <div style={{ display:"flex", gap:8 }}>
                  {["🖼️ Imagen","📄 PDF flyer","🎙️ Audio","🎥 Video"].map(a=>(
                    <button key={a} style={{ padding:"6px 12px", background:"#07101f", border:"1px solid #1e3a6e", borderRadius:8, color:"#64748b", fontSize:11, cursor:"pointer" }}>{a}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Texto */}
            <div style={{ marginBottom:18 }}>
              <div style={{ fontSize:10, color:"#475569", fontWeight:700, marginBottom:6 }}>MENSAJE</div>
              <textarea value={texto} onChange={e=>setTexto(e.target.value)}
                placeholder={`Hola {{nombre}}, el próximo domingo recuerda votar por nuestro candidato en {{puesto}}, mesa {{mesa}}. ¡Tu voto transforma a Sucre! 🗳️`}
                style={{ width:"100%", minHeight:110, background:"#07101f", border:"1px solid #1e3a6e", borderRadius:10, padding:12, color:"#e2e8f0", fontSize:12, resize:"vertical", outline:"none", boxSizing:"border-box", lineHeight:1.5 }}/>
              <div style={{ fontSize:9, color:"#475569", marginTop:4 }}>
                Variables: {"{{nombre}}"} {"{{puesto}}"} {"{{mesa}}"} {"{{municipio}}"} {"{{lider}}"} {"{{candidato}}"}
              </div>
            </div>

            <button onClick={send}
              style={{ width:"100%", background:`linear-gradient(135deg,${canalColor},${canalColor}cc)`, border:"none", borderRadius:12, padding:13, color:"#fff", fontSize:14, fontWeight:900, cursor:"pointer" }}>
              {canalIcon} Enviar ahora →
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ROOT APP
// ═══════════════════════════════════════════════════════════════
export default function App() {
  const [view,    setView]    = useState("dashboard");
  const [msgTarget, setMsg]   = useState(null);

  const { votantes: votantesCtx, usuarios, currentUser, logout } = useApp();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate("/login", { replace: true }); };

  const TABS = [
    { id:"dashboard",       icon:"📊", label:"Dashboard"     },
    { id:"estructura",      icon:"🏛️", label:"Estructura"    },
    { id:"votantes",        icon:"👥", label:"Votantes"      },
    { id:"lideres",         icon:"🤝", label:"Líderes"       },
    { id:"novedades",       icon:"🔔", label:"Novedades",     badge: NOVEDADES.filter(n=>!n.atendida).length },
    { id:"mensajeria",      icon:"💬", label:"Mensajería"    },
    { id:"divider" },
    { id:"g_usuarios",      icon:"🔑", label:"Usuarios",      section:"admin" },
    { id:"g_votantes",      icon:"📋", label:"Padrón CRUD",   section:"admin" },
  ];

  const totalVots = votantesCtx.length;
  const confGob   = votantesCtx.filter(v=>v.campañas.includes("GOB")&&v.estado["GOB"]==="confirmado").length;

  return (
    <div style={{ fontFamily:"'Sora','DM Sans',sans-serif", background:"#060c1a", minHeight:"100vh", color:"#e2e8f0" }}>

      {/* TOP BAR */}
      <div style={{ background:"#07101f", borderBottom:"1px solid #1e3a6e", height:58, display:"flex", alignItems:"center", padding:"0 24px", justifyContent:"space-between", position:"sticky", top:0, zIndex:100 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:38, height:38, borderRadius:10, background:"linear-gradient(135deg,#f59e0b,#b45309)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:19 }}>🗳️</div>
          <div>
            <div style={{ fontWeight:900, fontSize:15, color:"#fff", letterSpacing:"-.4px" }}>VotoControl <span style={{ color:"#f59e0b" }}>Pro</span></div>
            <div style={{ fontSize:9, color:"#334155" }}>PLATAFORMA ELECTORAL · SUCRE 2027 · 3 NIVELES</div>
          </div>
        </div>

        <div style={{ display:"flex", alignItems:"center", gap:16 }}>
          <div style={{ display:"flex", gap:6 }}>
            {[
              { v:totalVots,   l:"votantes",    c:"#e2e8f0" },
              { v:confGob,     l:"confirmados", c:"#10b981" },
              { v:LIDERES.length, l:"líderes",  c:"#f59e0b" },
            ].map(s=>(
              <div key={s.l} style={{ background:"#0d1b3e", border:"1px solid #1e3a6e", borderRadius:10, padding:"5px 12px", textAlign:"center" }}>
                <div style={{ fontSize:14, fontWeight:900, color:s.c }}>{s.v}</div>
                <div style={{ fontSize:8, color:"#334155", fontWeight:700 }}>{s.l.toUpperCase()}</div>
              </div>
            ))}
          </div>
          <button onClick={()=>setMsg({nombre:"TODA LA RED",scope:"gob"})}
            style={{ background:"#f59e0b22", border:"1px solid #f59e0b44", borderRadius:10, padding:"7px 16px", color:"#f59e0b", fontSize:12, fontWeight:800, cursor:"pointer" }}>
            📡 Difusión global
          </button>
          {/* Usuario actual + logout */}
          <div style={{ display:"flex", alignItems:"center", gap:8, marginLeft:8, paddingLeft:12, borderLeft:"1px solid #1e3a6e" }}>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:11, fontWeight:700, color:"#e2e8f0" }}>{currentUser?.nombre?.split(" ")[0]}</div>
              <div style={{ fontSize:9, color:"#4b6080", textTransform:"uppercase" }}>{currentUser?.rol}</div>
            </div>
            <button onClick={handleLogout} title="Cerrar sesión"
              style={{ background:"#ef444420", border:"1px solid #ef444444", borderRadius:8, padding:"6px 10px", color:"#ef4444", fontSize:11, fontWeight:700, cursor:"pointer" }}>
              ⏏ Salir
            </button>
          </div>
        </div>
      </div>

      <div style={{ display:"flex" }}>
        {/* SIDEBAR */}
        <div style={{ width:185, background:"#07101f", borderRight:"1px solid #1e3a6e", minHeight:"calc(100vh - 58px)", padding:"14px 0", flexShrink:0 }}>
          {TABS.map(t=> t.id==="divider"
            ? <div key="div" style={{ margin:"8px 14px", borderTop:"1px solid #1e3a6e", paddingTop:8 }}>
                <div style={{ fontSize:8, color:"#334155", fontWeight:700, letterSpacing:".08em", padding:"0 4px" }}>ADMINISTRACIÓN</div>
              </div>
            : (
            <button key={t.id} onClick={()=>setView(t.id)}
              style={{ display:"flex", alignItems:"center", justifyContent:"space-between", width:"100%", padding:"11px 18px",
                background:view===t.id ? (t.section==="admin"?"#7c3aed18":"#f59e0b15") : "transparent",
                border:"none",
                boxShadow: view===t.id ? `inset 3px 0 0 ${t.section==="admin"?"#7c3aed":"#f59e0b"}` : "none",
                color:view===t.id ? "#fff" : "#4b6080",
                fontSize:12, fontWeight:view===t.id?700:400, cursor:"pointer", textAlign:"left", transition:"all .15s",
              }}>
              <span>{t.icon} {t.label}</span>
              {t.badge > 0 && <span style={{ background:"#ef444430", color:"#ef4444", borderRadius:"50%", width:18, height:18, fontSize:10, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center" }}>{t.badge}</span>}
            </button>
          ))}

          {/* Hierarchy diagram */}
          <div style={{ margin:"20px 14px 0", background:"#0d1b3e", borderRadius:12, padding:12 }}>
            <div style={{ fontSize:9, color:"#334155", fontWeight:700, marginBottom:10, letterSpacing:".06em" }}>JERARQUÍA</div>
            {[
              { l:"Gobernador",         c:"#f59e0b", n:1, indent:0 },
              { l:"Alcaldes (3)",        c:"#3b82f6", n:3, indent:8 },
              { l:"Concejales (3)",      c:"#10b981", n:3, indent:8 },
              { l:"Asambleístas (2)",    c:"#a78bfa", n:2, indent:8 },
              { l:"Líderes (8)",         c:"#f59e0b", n:8, indent:16 },
            ].map(s=>(
              <div key={s.l} style={{ display:"flex", alignItems:"center", gap:6, marginBottom:5, paddingLeft:s.indent }}>
                {s.indent>0 && <span style={{ color:"#1e3a6e", fontSize:9 }}>└</span>}
                <span style={{ width:6, height:6, borderRadius:"50%", background:s.c, flexShrink:0 }}/>
                <span style={{ fontSize:10, color:"#64748b" }}>{s.l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* MAIN */}
        <div style={{ flex:1, padding:"24px 28px", overflowY:"auto", minHeight:"calc(100vh - 58px)" }}>
          <div style={{ marginBottom:20 }}>
            <h1 style={{ fontSize:20, fontWeight:900, color:"#fff", margin:0, letterSpacing:"-.4px" }}>
              {TABS.find(t=>t.id===view)?.icon} {TABS.find(t=>t.id===view)?.label}
            </h1>
          </div>

          {view==="dashboard"   && <DashboardMonitoreo/>}
          {view==="estructura"  && <ViewEstructura   onOpenMsg={setMsg}/>}
          {view==="votantes"    && <ViewVotantes     onOpenMsg={setMsg}/>}
          {view==="lideres"     && <ViewLideres      onOpenMsg={setMsg}/>}
          {view==="novedades"   && <ViewNovedades/>}
          {view==="mensajeria"  && <ViewMensajeria   onOpenMsg={setMsg}/>}
          {view==="g_usuarios"  && <GestionUsuarios/>}
          {view==="g_votantes"  && <GestionVotantes/>}
        </div>
      </div>

      {msgTarget && <ModalMensaje target={msgTarget} onClose={()=>setMsg(null)}/>}
    </div>
  );
}
