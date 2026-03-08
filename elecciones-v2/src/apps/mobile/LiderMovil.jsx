import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";

// ═══════════════════════════════════════════════════════
// DATA — El líder solo ve SUS votantes
// ═══════════════════════════════════════════════════════

const LIDER = {
  id: "L-01",
  nombre: "Franklyn Torres",
  tipo: "urbano",
  zona: "Com. 1 – Centro / Com. 2 – Las Américas",
  phone: "3001234567",
  candidato: "Carlos Martínez Ruiz",
  cargo: "Alcalde",
  municipio: "Sincelejo",
  campañaId: "C-01",
  campañaColor: "#3b82f6",
};

const INIT_VOTANTES = [
  { id:"V-001", nombre:"María González",    cedula:"10234567", phone:"3001112233", barrio:"Centro",       puesto:"IE Simón Bolívar", mesa:"12", estado:"confirmado",    contactado:true,  notas:"Confirmó por WhatsApp el 04 Mar" },
  { id:"V-002", nombre:"Juan Rodríguez",    cedula:"10345678", phone:"3112223344", barrio:"Las Américas", puesto:"IE Simón Bolívar", mesa:"07", estado:"pendiente",     contactado:true,  notas:"No ha respondido aún" },
  { id:"V-003", nombre:"Carmen Jiménez",    cedula:"10456789", phone:"3223334455", barrio:"Centro",       puesto:"IE La Esperanza",  mesa:"03", estado:"confirmado",    contactado:true,  notas:"Muy comprometida, tiene 4 más" },
  { id:"V-004", nombre:"Pedro Álvarez",     cedula:"10567890", phone:"3334445566", barrio:"Las Américas", puesto:"IE Politécnico",   mesa:"21", estado:"no_contactado", contactado:false, notas:"" },
  { id:"V-005", nombre:"Rosa Martínez",     cedula:"10678901", phone:"3001234567", barrio:"Centro",       puesto:"IE Simón Bolívar", mesa:"15", estado:"confirmado",    contactado:true,  notas:"Trae 2 familiares el día E" },
  { id:"V-006", nombre:"Luis Hernández",    cedula:"10789012", phone:"3123456789", barrio:"El Palmar",    puesto:"IE Simón Bolívar", mesa:"11", estado:"pendiente",     contactado:true,  notas:"Duda entre candidatos" },
  { id:"V-007", nombre:"Ana Pérez Díaz",    cedula:"10890123", phone:"3145678901", barrio:"Centro",       puesto:"IE La Esperanza",  mesa:"04", estado:"no_contactado", contactado:false, notas:"" },
  { id:"V-008", nombre:"Iván Díaz Polo",    cedula:"11123456", phone:"3178901234", barrio:"Las Américas", puesto:"IE Politécnico",   mesa:"18", estado:"confirmado",    contactado:true,  notas:"Líder natural de su cuadra" },
  { id:"V-009", nombre:"Sandra López",      cedula:"11234567", phone:"3189012345", barrio:"Centro",       puesto:"IE Simón Bolívar", mesa:"11", estado:"confirmado",    contactado:true,  notas:"" },
  { id:"V-010", nombre:"Carlos Ruiz Ortiz", cedula:"11345678", phone:"3190123456", barrio:"Las Américas", puesto:"IE La Esperanza",  mesa:"04", estado:"no_contactado", contactado:false, notas:"Número sin WhatsApp, llamar" },
  { id:"V-011", nombre:"Luz Dary Caro",     cedula:"11456789", phone:"3201234567", barrio:"Centro",       puesto:"IE Simón Bolívar", mesa:"12", estado:"pendiente",     contactado:true,  notas:"Hablar con su esposo primero" },
  { id:"V-012", nombre:"Hernando Puerta",   cedula:"11567890", phone:"3212345678", barrio:"Las Américas", puesto:"IE Politécnico",   mesa:"21", estado:"confirmado",    contactado:true,  notas:"Confirmado, ya tiene transporte" },
];

const NOVEDAD_TIPOS = [
  { k:"cambio_opinion", icon:"⚠️", label:"Cambió de opinión",  color:"#ef4444" },
  { k:"traslado",       icon:"🚚", label:"Se trasladó",        color:"#f59e0b" },
  { k:"fallecido",      icon:"🕊️", label:"Falleció",           color:"#6b7280" },
  { k:"nuevo_apoyo",    icon:"🎉", label:"Nuevo apoyo",        color:"#10b981" },
  { k:"sin_transporte", icon:"🚗", label:"Sin transporte",     color:"#a78bfa" },
  { k:"otro",           icon:"📝", label:"Otro",               color:"#64748b" },
];

const ESTADO_META = {
  confirmado:    { label:"Confirmado",   color:"#10b981", bg:"#10b98118", icon:"✅" },
  pendiente:     { label:"Pendiente",    color:"#f59e0b", bg:"#f59e0b18", icon:"⏳" },
  no_contactado: { label:"Sin contacto", color:"#6b7280", bg:"#6b728018", icon:"📵" },
};

// ═══════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════

function StatusPill({ estado }) {
  const m = ESTADO_META[estado];
  return (
    <span style={{ padding:"3px 10px", borderRadius:20, fontSize:10, fontWeight:700,
      background:m.bg, color:m.color, border:`1px solid ${m.color}40`, whiteSpace:"nowrap" }}>
      {m.icon} {m.label}
    </span>
  );
}

function Avatar({ nombre, size=38, color="#3b82f6" }) {
  const initials = nombre.split(" ").slice(0,2).map(w=>w[0]).join("");
  return (
    <div style={{ width:size, height:size, borderRadius:"50%",
      background:`linear-gradient(135deg,${color}88,${color}44)`,
      border:`2px solid ${color}55`,
      display:"flex", alignItems:"center", justifyContent:"center",
      fontSize:size*0.35, fontWeight:800, color:"#fff", flexShrink:0 }}>
      {initials}
    </div>
  );
}

// ─── SCREEN: HOME ─────────────────────────────────────
function ScreenHome({ votantes, onNav }) {
  const conf    = votantes.filter(v=>v.estado==="confirmado").length;
  const pend    = votantes.filter(v=>v.estado==="pendiente").length;
  const noContact = votantes.filter(v=>v.estado==="no_contactado").length;
  const total   = votantes.length;
  const pctConf = Math.round((conf/total)*100);

  // Progress ring
  const r = 54, circ = 2*Math.PI*r;
  const fill = circ * (conf/total);

  return (
    <div style={{ padding:"0 0 80px" }}>
      {/* Hero card */}
      <div style={{ background:"linear-gradient(160deg,#0f1f45 0%,#1a3068 60%,#0d1b3e 100%)", padding:"28px 20px 24px", borderBottom:"1px solid #1e3a6e20" }}>
        <div style={{ fontSize:11, color:"#f59e0b", fontWeight:800, letterSpacing:".08em", marginBottom:4 }}>
          MI CAMPAÑA
        </div>
        <div style={{ fontSize:18, fontWeight:900, color:"#fff", lineHeight:1.2, marginBottom:2 }}>
          {LIDER.candidato}
        </div>
        <div style={{ fontSize:11, color:"#64748b" }}>{LIDER.cargo} · {LIDER.municipio}</div>

        {/* Big ring + stats */}
        <div style={{ display:"flex", alignItems:"center", gap:20, marginTop:20 }}>
          <div style={{ position:"relative", width:128, height:128, flexShrink:0 }}>
            <svg width={128} height={128} style={{ transform:"rotate(-90deg)" }}>
              <circle cx={64} cy={64} r={r} fill="none" stroke="#1e3a6e" strokeWidth={10}/>
              <circle cx={64} cy={64} r={r} fill="none" stroke="#3b82f6" strokeWidth={10}
                strokeDasharray={`${fill} ${circ}`} strokeLinecap="round"/>
            </svg>
            <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
              <div style={{ fontSize:28, fontWeight:900, color:"#fff" }}>{pctConf}%</div>
              <div style={{ fontSize:9, color:"#64748b", fontWeight:700 }}>AVANCE</div>
            </div>
          </div>

          <div style={{ flex:1, display:"flex", flexDirection:"column", gap:10 }}>
            {[
              { v:total,    l:"Total asignados", c:"#e2e8f0" },
              { v:conf,     l:"Confirmados",      c:"#10b981" },
              { v:pend,     l:"Pendientes",       c:"#f59e0b" },
              { v:noContact,l:"Sin contactar",    c:"#6b7280" },
            ].map(s=>(
              <div key={s.l} style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontSize:12, color:"#64748b" }}>{s.l}</span>
                <span style={{ fontSize:16, fontWeight:900, color:s.c }}>{s.v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginTop:16, height:6, background:"#1e3a6e", borderRadius:3 }}>
          <div style={{ height:"100%", width:`${pctConf}%`, background:"linear-gradient(90deg,#3b82f6,#60a5fa)", borderRadius:3, transition:"width .5s" }}/>
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:5 }}>
          <span style={{ fontSize:9, color:"#475569" }}>0</span>
          <span style={{ fontSize:9, color:"#3b82f6", fontWeight:700 }}>{conf} confirmados</span>
          <span style={{ fontSize:9, color:"#475569" }}>Meta: {total}</span>
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ padding:"18px 16px 0" }}>
        <div style={{ fontSize:11, color:"#475569", fontWeight:700, letterSpacing:".06em", marginBottom:12 }}>ACCIONES RÁPIDAS</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          {[
            { icon:"👥", label:"Mis votantes",     color:"#3b82f6", screen:"votantes" },
            { icon:"➕", label:"Agregar votante",  color:"#10b981", screen:"agregar"  },
            { icon:"🔔", label:"Reportar novedad", color:"#f59e0b", screen:"novedad"  },
            { icon:"💬", label:"Enviar mensaje",   color:"#25d366", screen:"mensaje"  },
          ].map(a=>(
            <button key={a.screen} onClick={()=>onNav(a.screen)}
              style={{ background:`${a.color}12`, border:`1px solid ${a.color}35`, borderRadius:14,
                padding:"16px 14px", display:"flex", alignItems:"center", gap:10,
                cursor:"pointer", transition:"all .15s" }}>
              <span style={{ fontSize:22 }}>{a.icon}</span>
              <span style={{ fontSize:12, fontWeight:700, color:"#e2e8f0" }}>{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Sin contactar urgente */}
      {noContact > 0 && (
        <div onClick={()=>onNav("votantes")} style={{ margin:"18px 16px 0", background:"#ef444412", border:"1px solid #ef444430", borderRadius:14, padding:"14px 16px", cursor:"pointer", display:"flex", alignItems:"center", gap:12 }}>
          <span style={{ fontSize:22 }}>📵</span>
          <div>
            <div style={{ fontSize:13, fontWeight:700, color:"#fca5a5" }}>{noContact} votantes sin contactar</div>
            <div style={{ fontSize:11, color:"#ef4444" }}>Toca para ver y contactar ahora →</div>
          </div>
        </div>
      )}

      {/* Últimos votantes */}
      <div style={{ padding:"18px 16px 0" }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
          <span style={{ fontSize:11, color:"#475569", fontWeight:700, letterSpacing:".06em" }}>ÚLTIMOS REGISTROS</span>
          <span onClick={()=>onNav("votantes")} style={{ fontSize:11, color:"#3b82f6", fontWeight:700, cursor:"pointer" }}>Ver todos →</span>
        </div>
        {votantes.slice(0,4).map(v=>(
          <div key={v.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"11px 0", borderBottom:"1px solid #1e3a6e20" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <Avatar nombre={v.nombre} size={36} color={ESTADO_META[v.estado].color}/>
              <div>
                <div style={{ fontSize:13, fontWeight:600, color:"#e2e8f0" }}>{v.nombre}</div>
                <div style={{ fontSize:10, color:"#475569" }}>{v.barrio} · Mesa {v.mesa}</div>
              </div>
            </div>
            <StatusPill estado={v.estado}/>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SCREEN: VOTANTES ─────────────────────────────────
function ScreenVotantes({ votantes, onEdit, onSelect }) {
  const [filter,  setFilter]  = useState("all");
  const [search,  setSearch]  = useState("");

  const list = useMemo(()=> votantes.filter(v => {
    if (filter !== "all" && v.estado !== filter) return false;
    if (search && !v.nombre.toLowerCase().includes(search.toLowerCase()) &&
        !v.cedula.includes(search)) return false;
    return true;
  }), [votantes, filter, search]);

  const counts = {
    all:          votantes.length,
    confirmado:   votantes.filter(v=>v.estado==="confirmado").length,
    pendiente:    votantes.filter(v=>v.estado==="pendiente").length,
    no_contactado:votantes.filter(v=>v.estado==="no_contactado").length,
  };

  return (
    <div style={{ padding:"0 0 80px" }}>
      {/* Search */}
      <div style={{ padding:"14px 16px", position:"sticky", top:58, background:"#060c1a", zIndex:10, borderBottom:"1px solid #1e3a6e20" }}>
        <div style={{ position:"relative" }}>
          <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", fontSize:14, color:"#475569" }}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Nombre o cédula..."
            style={{ width:"100%", background:"#0d1b3e", border:"1px solid #1e3a6e", borderRadius:12,
              padding:"10px 14px 10px 36px", color:"#e2e8f0", fontSize:13, outline:"none", boxSizing:"border-box" }}/>
        </div>
      </div>

      {/* Filters tabs */}
      <div style={{ display:"flex", gap:6, padding:"10px 16px", overflowX:"auto" }}>
        {[
          { k:"all",           l:`Todos (${counts.all})`,            c:"#3b82f6" },
          { k:"confirmado",    l:`✅ Conf. (${counts.confirmado})`,   c:"#10b981" },
          { k:"pendiente",     l:`⏳ Pend. (${counts.pendiente})`,    c:"#f59e0b" },
          { k:"no_contactado", l:`📵 S/C (${counts.no_contactado})`,  c:"#6b7280" },
        ].map(f=>(
          <button key={f.k} onClick={()=>setFilter(f.k)}
            style={{ padding:"6px 14px", borderRadius:20, fontSize:11, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap",
              background: filter===f.k ? `${f.c}22` : "#0d1b3e",
              border: `1px solid ${filter===f.k ? f.c+"66" : "#1e3a6e"}`,
              color: filter===f.k ? f.c : "#475569",
            }}>{f.l}</button>
        ))}
      </div>

      {/* List */}
      <div style={{ padding:"0 16px" }}>
        {list.length === 0 && (
          <div style={{ textAlign:"center", padding:"40px 0", color:"#475569" }}>
            <div style={{ fontSize:32, marginBottom:8 }}>🔍</div>
            <div style={{ fontSize:13 }}>No hay votantes con ese filtro</div>
          </div>
        )}
        {list.map(v=>(
          <div key={v.id} onClick={()=>onSelect(v)}
            style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
              padding:"14px 0", borderBottom:"1px solid #1e3a6e20", cursor:"pointer" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <Avatar nombre={v.nombre} size={42} color={ESTADO_META[v.estado].color}/>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:"#e2e8f0" }}>{v.nombre}</div>
                <div style={{ fontSize:10, color:"#475569", marginTop:2 }}>
                  {v.cedula} · {v.barrio}
                </div>
                <div style={{ fontSize:10, color:"#334155", marginTop:1 }}>
                  {v.puesto} · Mesa {v.mesa}
                </div>
              </div>
            </div>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:5 }}>
              <StatusPill estado={v.estado}/>
              <span style={{ fontSize:10, color:"#334155" }}>›</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SCREEN: DETALLE VOTANTE ───────────────────────────
function ScreenDetalle({ votante, onBack, onUpdate, onNovedad }) {
  const [editEstado, setEditEstado] = useState(false);
  const [nota, setNota] = useState(votante.notas || "");
  const [saved, setSaved] = useState(false);

  const saveNota = () => {
    onUpdate(votante.id, { notas: nota });
    setSaved(true);
    setTimeout(()=>setSaved(false), 1800);
  };

  const changeEstado = (nuevoEstado) => {
    onUpdate(votante.id, { estado: nuevoEstado, contactado: true });
    setEditEstado(false);
  };

  return (
    <div style={{ padding:"0 0 80px" }}>
      {/* Header */}
      <div style={{ background:"linear-gradient(160deg,#0d1b3e,#1a2a5e)", padding:"20px 16px 24px", borderBottom:"1px solid #1e3a6e" }}>
        <button onClick={onBack} style={{ background:"none", border:"none", color:"#3b82f6", fontSize:13, fontWeight:700, cursor:"pointer", padding:"0 0 12px" }}>
          ← Volver
        </button>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <Avatar nombre={votante.nombre} size={56} color={ESTADO_META[votante.estado].color}/>
          <div>
            <div style={{ fontSize:18, fontWeight:900, color:"#fff" }}>{votante.nombre}</div>
            <div style={{ fontSize:11, color:"#64748b", marginTop:2 }}>CC {votante.cedula}</div>
            <div style={{ marginTop:6 }}><StatusPill estado={votante.estado}/></div>
          </div>
        </div>
      </div>

      <div style={{ padding:"16px" }}>
        {/* Info cards */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
          {[
            { icon:"📍", label:"Barrio",    value:votante.barrio },
            { icon:"📱", label:"Teléfono",  value:votante.phone  },
            { icon:"🏫", label:"Puesto",    value:votante.puesto },
            { icon:"🗳️", label:"Mesa",      value:votante.mesa   },
          ].map(f=>(
            <div key={f.label} style={{ background:"#0d1b3e", border:"1px solid #1e3a6e", borderRadius:12, padding:"12px 14px" }}>
              <div style={{ fontSize:9, color:"#475569", fontWeight:700, marginBottom:4 }}>{f.icon} {f.label.toUpperCase()}</div>
              <div style={{ fontSize:13, color:"#e2e8f0", fontWeight:600 }}>{f.value}</div>
            </div>
          ))}
        </div>

        {/* Estado con cambio */}
        <div style={{ background:"#0d1b3e", border:"1px solid #1e3a6e", borderRadius:14, padding:16, marginBottom:14 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom: editEstado ? 12 : 0 }}>
            <div>
              <div style={{ fontSize:9, color:"#475569", fontWeight:700, marginBottom:4 }}>ESTADO EN CAMPAÑA</div>
              <StatusPill estado={votante.estado}/>
            </div>
            <button onClick={()=>setEditEstado(!editEstado)}
              style={{ background:"#3b82f620", border:"1px solid #3b82f640", borderRadius:8, padding:"6px 12px", color:"#3b82f6", fontSize:11, fontWeight:700, cursor:"pointer" }}>
              {editEstado ? "Cancelar" : "✏️ Cambiar"}
            </button>
          </div>
          {editEstado && (
            <div style={{ display:"flex", flexDirection:"column", gap:8, marginTop:8 }}>
              {Object.entries(ESTADO_META).map(([k,m])=>(
                <button key={k} onClick={()=>changeEstado(k)}
                  style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 14px",
                    background: votante.estado===k ? `${m.color}22` : "#080d1c",
                    border: `1.5px solid ${votante.estado===k ? m.color+"66" : "#1e3a6e"}`,
                    borderRadius:10, cursor:"pointer", textAlign:"left" }}>
                  <span style={{ fontSize:18 }}>{m.icon}</span>
                  <div>
                    <div style={{ fontSize:13, fontWeight:700, color:m.color }}>{m.label}</div>
                  </div>
                  {votante.estado===k && <span style={{ marginLeft:"auto", color:m.color, fontSize:16 }}>✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notas */}
        <div style={{ background:"#0d1b3e", border:"1px solid #1e3a6e", borderRadius:14, padding:16, marginBottom:14 }}>
          <div style={{ fontSize:9, color:"#475569", fontWeight:700, marginBottom:8 }}>📝 NOTAS PRIVADAS</div>
          <textarea value={nota} onChange={e=>setNota(e.target.value)}
            placeholder="Agregar notas sobre este votante..."
            style={{ width:"100%", minHeight:80, background:"#080d1c", border:"1px solid #1e3a6e", borderRadius:10,
              padding:10, color:"#e2e8f0", fontSize:13, resize:"none", outline:"none", boxSizing:"border-box", lineHeight:1.5 }}/>
          <button onClick={saveNota}
            style={{ marginTop:8, width:"100%", background: saved ? "#10b98122" : "#3b82f622",
              border:`1px solid ${saved?"#10b98144":"#3b82f644"}`, borderRadius:10, padding:"9px",
              color: saved ? "#10b981" : "#3b82f6", fontSize:12, fontWeight:700, cursor:"pointer", transition:"all .3s" }}>
            {saved ? "✅ Guardado" : "Guardar notas"}
          </button>
        </div>

        {/* Acciones de contacto */}
        <div style={{ background:"#0d1b3e", border:"1px solid #1e3a6e", borderRadius:14, padding:16, marginBottom:14 }}>
          <div style={{ fontSize:9, color:"#475569", fontWeight:700, marginBottom:12 }}>CONTACTAR</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            <a href={`https://wa.me/57${votante.phone}`} target="_blank" rel="noreferrer"
              style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6, padding:"14px 10px",
                background:"#25d36618", border:"1px solid #25d36640", borderRadius:12, textDecoration:"none", cursor:"pointer" }}>
              <span style={{ fontSize:24 }}>💬</span>
              <span style={{ fontSize:11, fontWeight:700, color:"#25d366" }}>WhatsApp</span>
              <span style={{ fontSize:10, color:"#475569" }}>{votante.phone}</span>
            </a>
            <a href={`tel:${votante.phone}`}
              style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6, padding:"14px 10px",
                background:"#0ea5e918", border:"1px solid #0ea5e940", borderRadius:12, textDecoration:"none", cursor:"pointer" }}>
              <span style={{ fontSize:24 }}>📞</span>
              <span style={{ fontSize:11, fontWeight:700, color:"#0ea5e9" }}>Llamar</span>
              <span style={{ fontSize:10, color:"#475569" }}>{votante.phone}</span>
            </a>
          </div>
        </div>

        {/* Reportar novedad sobre este votante */}
        <button onClick={()=>onNovedad(votante)}
          style={{ width:"100%", background:"#f59e0b18", border:"1px solid #f59e0b40", borderRadius:14,
            padding:"14px", display:"flex", alignItems:"center", justifyContent:"center", gap:10,
            color:"#f59e0b", fontSize:13, fontWeight:700, cursor:"pointer" }}>
          🔔 Reportar novedad sobre este votante
        </button>
      </div>
    </div>
  );
}

// ─── SCREEN: AGREGAR VOTANTE ───────────────────────────
function ScreenAgregar({ onSave, onBack }) {
  const [form, setForm] = useState({ nombre:"", cedula:"", phone:"", barrio:"", puesto:"", mesa:"", estado:"pendiente", notas:"" });
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);

  const set = (k,v) => setForm(p=>({...p,[k]:v}));

  const validate = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = "Requerido";
    if (!form.cedula.trim()) e.cedula = "Requerido";
    if (!form.phone.trim())  e.phone  = "Requerido";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = () => {
    if (!validate()) return;
    onSave({ ...form, id:`V-NEW-${Date.now()}`, contactado: form.estado !== "no_contactado" });
    setDone(true);
    setTimeout(()=>{ setDone(false); onBack(); }, 1800);
  };

  const fields = [
    { k:"nombre", label:"Nombre completo",   placeholder:"Ej: María González",       type:"text",  req:true  },
    { k:"cedula", label:"Cédula",            placeholder:"Ej: 10234567",             type:"tel",   req:true  },
    { k:"phone",  label:"Teléfono / WhatsApp",placeholder:"Ej: 3001234567",          type:"tel",   req:true  },
    { k:"barrio", label:"Barrio / Vereda",   placeholder:"Ej: Centro",               type:"text",  req:false },
    { k:"puesto", label:"Puesto de votación",placeholder:"Ej: IE Simón Bolívar",     type:"text",  req:false },
    { k:"mesa",   label:"Mesa",              placeholder:"Ej: 12",                   type:"tel",   req:false },
  ];

  if (done) return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"60vh", padding:24 }}>
      <div style={{ fontSize:56, marginBottom:16 }}>🎉</div>
      <div style={{ fontSize:20, fontWeight:900, color:"#10b981" }}>¡Votante registrado!</div>
      <div style={{ fontSize:13, color:"#64748b", marginTop:6 }}>Agregado a tu lista</div>
    </div>
  );

  return (
    <div style={{ padding:"0 16px 80px" }}>
      <button onClick={onBack} style={{ background:"none", border:"none", color:"#3b82f6", fontSize:13, fontWeight:700, cursor:"pointer", padding:"16px 0 12px" }}>
        ← Cancelar
      </button>
      <div style={{ fontSize:18, fontWeight:900, color:"#fff", marginBottom:20 }}>Nuevo votante</div>

      {fields.map(f=>(
        <div key={f.k} style={{ marginBottom:14 }}>
          <div style={{ fontSize:10, color: errors[f.k]?"#ef4444":"#475569", fontWeight:700, marginBottom:5 }}>
            {f.label.toUpperCase()}{f.req && <span style={{ color:"#ef4444" }}> *</span>}
          </div>
          <input value={form[f.k]} onChange={e=>set(f.k,e.target.value)} placeholder={f.placeholder} type={f.type}
            style={{ width:"100%", background:"#0d1b3e", border:`1px solid ${errors[f.k]?"#ef4444":"#1e3a6e"}`,
              borderRadius:12, padding:"13px 14px", color:"#e2e8f0", fontSize:14, outline:"none", boxSizing:"border-box" }}/>
          {errors[f.k] && <div style={{ fontSize:10, color:"#ef4444", marginTop:3 }}>⚠️ {errors[f.k]}</div>}
        </div>
      ))}

      {/* Estado inicial */}
      <div style={{ marginBottom:14 }}>
        <div style={{ fontSize:10, color:"#475569", fontWeight:700, marginBottom:8 }}>ESTADO INICIAL</div>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {Object.entries(ESTADO_META).map(([k,m])=>(
            <button key={k} onClick={()=>set("estado",k)}
              style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 14px",
                background: form.estado===k ? `${m.color}22` : "#0d1b3e",
                border: `1.5px solid ${form.estado===k ? m.color+"66" : "#1e3a6e"}`,
                borderRadius:12, cursor:"pointer", textAlign:"left" }}>
              <span style={{ fontSize:20 }}>{m.icon}</span>
              <span style={{ fontSize:13, fontWeight:700, color: form.estado===k ? m.color : "#94a3b8" }}>{m.label}</span>
              {form.estado===k && <span style={{ marginLeft:"auto", color:m.color }}>✓</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Notas */}
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:10, color:"#475569", fontWeight:700, marginBottom:5 }}>NOTAS (OPCIONAL)</div>
        <textarea value={form.notas} onChange={e=>set("notas",e.target.value)} placeholder="Observaciones, referidos, transporte..."
          style={{ width:"100%", minHeight:70, background:"#0d1b3e", border:"1px solid #1e3a6e", borderRadius:12,
            padding:"13px 14px", color:"#e2e8f0", fontSize:13, resize:"none", outline:"none", boxSizing:"border-box" }}/>
      </div>

      <button onClick={submit}
        style={{ width:"100%", background:"linear-gradient(135deg,#10b981,#059669)", border:"none",
          borderRadius:14, padding:"15px", color:"#fff", fontSize:15, fontWeight:900, cursor:"pointer" }}>
        ✅ Registrar votante
      </button>
    </div>
  );
}

// ─── SCREEN: REPORTAR NOVEDAD ─────────────────────────
function ScreenNovedad({ votante, onBack, onSend }) {
  const [tipo,  setTipo]  = useState(null);
  const [desc,  setDesc]  = useState("");
  const [done,  setDone]  = useState(false);

  const submit = () => {
    if (!tipo) return;
    onSend({ tipo, desc, votanteId: votante?.id, votanteNombre: votante?.nombre });
    setDone(true);
    setTimeout(()=>{ setDone(false); onBack(); }, 2000);
  };

  if (done) return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"60vh", padding:24 }}>
      <div style={{ fontSize:56, marginBottom:16 }}>📤</div>
      <div style={{ fontSize:18, fontWeight:900, color:"#f59e0b" }}>Novedad reportada</div>
      <div style={{ fontSize:12, color:"#64748b", marginTop:6, textAlign:"center" }}>El coordinador fue notificado</div>
    </div>
  );

  return (
    <div style={{ padding:"0 16px 80px" }}>
      <button onClick={onBack} style={{ background:"none", border:"none", color:"#3b82f6", fontSize:13, fontWeight:700, cursor:"pointer", padding:"16px 0 12px" }}>
        ← Cancelar
      </button>
      <div style={{ fontSize:18, fontWeight:900, color:"#fff", marginBottom:4 }}>Reportar novedad</div>
      {votante && <div style={{ fontSize:12, color:"#3b82f6", marginBottom:20, fontWeight:600 }}>Sobre: {votante.nombre}</div>}
      {!votante && <div style={{ fontSize:12, color:"#64748b", marginBottom:20 }}>Reporte general de tu zona</div>}

      <div style={{ fontSize:10, color:"#475569", fontWeight:700, marginBottom:10 }}>TIPO DE NOVEDAD</div>
      <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:18 }}>
        {NOVEDAD_TIPOS.map(n=>(
          <button key={n.k} onClick={()=>setTipo(n.k)}
            style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 16px",
              background: tipo===n.k ? `${n.color}20` : "#0d1b3e",
              border: `1.5px solid ${tipo===n.k ? n.color+"70" : "#1e3a6e"}`,
              borderRadius:14, cursor:"pointer", textAlign:"left", transition:"all .15s" }}>
            <span style={{ fontSize:22 }}>{n.icon}</span>
            <span style={{ fontSize:13, fontWeight:700, color: tipo===n.k ? n.color : "#94a3b8" }}>{n.label}</span>
            {tipo===n.k && <span style={{ marginLeft:"auto", color:n.color, fontSize:18 }}>✓</span>}
          </button>
        ))}
      </div>

      <div style={{ fontSize:10, color:"#475569", fontWeight:700, marginBottom:6 }}>DESCRIPCIÓN</div>
      <textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Describe lo que ocurrió con detalle..."
        style={{ width:"100%", minHeight:90, background:"#0d1b3e", border:"1px solid #1e3a6e", borderRadius:12,
          padding:"13px 14px", color:"#e2e8f0", fontSize:13, resize:"none", outline:"none", boxSizing:"border-box", marginBottom:20 }}/>

      <button onClick={submit} disabled={!tipo}
        style={{ width:"100%", background: tipo ? "linear-gradient(135deg,#f59e0b,#d97706)" : "#1e3a6e",
          border:"none", borderRadius:14, padding:"15px", color: tipo ? "#000" : "#475569",
          fontSize:15, fontWeight:900, cursor: tipo ? "pointer" : "not-allowed" }}>
        📤 Enviar novedad al coordinador
      </button>
    </div>
  );
}

// ─── SCREEN: MENSAJE ──────────────────────────────────
function ScreenMensaje({ votantes, onBack }) {
  const [canal,    setCanal]    = useState("whatsapp");
  const [segmento, setSegmento] = useState("all");
  const [texto,    setTexto]    = useState("");
  const [sent,     setSent]     = useState(false);

  const destCount = segmento === "all" ? votantes.length : votantes.filter(v=>v.estado===segmento).length;
  const canalColor = canal === "whatsapp" ? "#25d366" : "#0ea5e9";

  const send = () => {
    setSent(true);
    setTimeout(()=>{ setSent(false); onBack(); }, 2500);
  };

  if (sent) return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"60vh", padding:24 }}>
      <div style={{ fontSize:56, marginBottom:16 }}>{canal==="whatsapp"?"💬":"📱"}</div>
      <div style={{ fontSize:18, fontWeight:900, color:canalColor }}>¡Mensajes enviados!</div>
      <div style={{ fontSize:13, color:"#64748b", marginTop:6 }}>{destCount} destinatarios procesados</div>
    </div>
  );

  return (
    <div style={{ padding:"0 16px 80px" }}>
      <button onClick={onBack} style={{ background:"none", border:"none", color:"#3b82f6", fontSize:13, fontWeight:700, cursor:"pointer", padding:"16px 0 12px" }}>
        ← Cancelar
      </button>
      <div style={{ fontSize:18, fontWeight:900, color:"#fff", marginBottom:20 }}>Enviar mensaje</div>

      {/* Canal */}
      <div style={{ fontSize:10, color:"#475569", fontWeight:700, marginBottom:8 }}>CANAL</div>
      <div style={{ display:"flex", gap:10, marginBottom:18 }}>
        {[{k:"whatsapp",l:"💬 WhatsApp",c:"#25d366"},{k:"sms",l:"📱 SMS",c:"#0ea5e9"}].map(ch=>(
          <button key={ch.k} onClick={()=>setCanal(ch.k)}
            style={{ flex:1, padding:"12px 0", borderRadius:12, cursor:"pointer",
              background: canal===ch.k ? `${ch.c}22` : "#0d1b3e",
              border: `1.5px solid ${canal===ch.k ? ch.c+"88" : "#1e3a6e"}`,
              color: canal===ch.k ? ch.c : "#475569", fontSize:13, fontWeight:700 }}>
            {ch.l}
          </button>
        ))}
      </div>

      {/* Destinatarios */}
      <div style={{ fontSize:10, color:"#475569", fontWeight:700, marginBottom:8 }}>DESTINATARIOS</div>
      <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:18 }}>
        {[
          { k:"all",           l:`Todos mis votantes`,                   count: votantes.length },
          { k:"confirmado",    l:`Solo confirmados`,                     count: votantes.filter(v=>v.estado==="confirmado").length },
          { k:"pendiente",     l:`Solo pendientes`,                      count: votantes.filter(v=>v.estado==="pendiente").length },
          { k:"no_contactado", l:`Sin contactar`,                        count: votantes.filter(v=>v.estado==="no_contactado").length },
        ].map(s=>(
          <button key={s.k} onClick={()=>setSegmento(s.k)}
            style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 14px",
              background: segmento===s.k ? `${canalColor}18` : "#0d1b3e",
              border: `1.5px solid ${segmento===s.k ? canalColor+"66" : "#1e3a6e"}`,
              borderRadius:12, cursor:"pointer" }}>
            <span style={{ fontSize:13, color: segmento===s.k ? "#fff" : "#94a3b8", fontWeight: segmento===s.k ? 700 : 400 }}>{s.l}</span>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontSize:13, fontWeight:800, color: segmento===s.k ? canalColor : "#475569" }}>{s.count}</span>
              {segmento===s.k && <span style={{ color:canalColor }}>✓</span>}
            </div>
          </button>
        ))}
      </div>

      {/* WhatsApp multimedia */}
      {canal==="whatsapp" && (
        <>
          <div style={{ fontSize:10, color:"#475569", fontWeight:700, marginBottom:8 }}>ADJUNTAR</div>
          <div style={{ display:"flex", gap:8, marginBottom:18, overflowX:"auto" }}>
            {["🖼️ Imagen","📄 Flyer","🎙️ Audio","🎥 Video"].map(a=>(
              <button key={a} style={{ padding:"8px 14px", background:"#0d1b3e", border:"1px solid #1e3a6e",
                borderRadius:10, color:"#64748b", fontSize:11, cursor:"pointer", whiteSpace:"nowrap" }}>{a}</button>
            ))}
          </div>
        </>
      )}

      {/* Texto */}
      <div style={{ fontSize:10, color:"#475569", fontWeight:700, marginBottom:6 }}>MENSAJE</div>
      <textarea value={texto} onChange={e=>setTexto(e.target.value)}
        placeholder={`Hola {{nombre}}, el domingo vota en {{puesto}}, mesa {{mesa}}. ¡Contamos contigo! — ${LIDER.nombre}`}
        style={{ width:"100%", minHeight:110, background:"#0d1b3e", border:"1px solid #1e3a6e", borderRadius:12,
          padding:"13px 14px", color:"#e2e8f0", fontSize:13, resize:"none", outline:"none", boxSizing:"border-box", marginBottom:6 }}/>
      <div style={{ fontSize:9, color:"#475569", marginBottom:20 }}>
        Variables: {"{{nombre}}"} {"{{puesto}}"} {"{{mesa}}"}
      </div>

      {/* Summary */}
      <div style={{ background:`${canalColor}12`, border:`1px solid ${canalColor}30`, borderRadius:12, padding:"12px 14px", marginBottom:16, display:"flex", gap:10, alignItems:"center" }}>
        <span style={{ fontSize:20 }}>{canal==="whatsapp"?"💬":"📱"}</span>
        <div style={{ fontSize:12, color:"#94a3b8" }}>
          Se enviarán <span style={{ fontWeight:900, color:canalColor }}>{destCount} mensajes</span> personalizados a tus votantes
        </div>
      </div>

      <button onClick={send} disabled={!texto.trim()}
        style={{ width:"100%", background: texto.trim() ? `linear-gradient(135deg,${canalColor},${canalColor}cc)` : "#1e3a6e",
          border:"none", borderRadius:14, padding:"15px", color: texto.trim() ? "#fff" : "#475569",
          fontSize:15, fontWeight:900, cursor: texto.trim() ? "pointer" : "not-allowed" }}>
        Enviar {destCount} mensajes →
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// ROOT — MOBILE APP
// ═══════════════════════════════════════════════════════
export default function LiderMovil() {
  const { logout } = useApp();
  const navigate   = useNavigate();
  const handleLogout = () => { logout(); navigate("/login", { replace: true }); };
  const [screen,    setScreen]   = useState("home");
  const [votantes,  setVotantes] = useState(INIT_VOTANTES);
  const [selected,  setSelected] = useState(null);
  const [novedadVot,setNovVot]   = useState(null);

  const updateVotante = (id, patch) => {
    setVotantes(prev => prev.map(v => v.id===id ? {...v,...patch} : v));
  };

  const addVotante = (v) => {
    setVotantes(prev => [...prev, v]);
  };

  const nav = (s, extra) => {
    if (s==="novedad" && extra) setNovVot(extra); else setNovVot(null);
    if (s==="detalle" && extra) setSelected(extra);
    setScreen(s);
  };

  // Bottom nav tabs
  const BNAV = [
    { id:"home",     icon:"🏠", label:"Inicio"   },
    { id:"votantes", icon:"👥", label:"Votantes"  },
    { id:"agregar",  icon:"➕", label:"Agregar"   },
    { id:"novedad",  icon:"🔔", label:"Reportar"  },
    { id:"mensaje",  icon:"💬", label:"Mensaje"   },
  ];

  const mainScreens = ["home","votantes","agregar","novedad","mensaje"];

  return (
    <div style={{ display:"flex", justifyContent:"center", alignItems:"flex-start", minHeight:"100vh", background:"#030712", padding:"20px 0" }}>
      {/* Phone frame */}
      <div style={{
        width: 390,
        maxWidth: "100vw",
        minHeight: 780,
        background: "#060c1a",
        borderRadius: 40,
        overflow: "hidden",
        boxShadow: "0 40px 120px #000c, 0 0 0 1px #1e3a6e44",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Sora','DM Sans',sans-serif",
        color: "#e2e8f0",
      }}>
        {/* Status bar */}
        <div style={{ background:"#07101f", padding:"12px 20px 8px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontSize:11, fontWeight:700, color:"#e2e8f0" }}>9:41</span>
          <div style={{ width:80, height:18, background:"#1e3a6e", borderRadius:10 }}/>
          <div style={{ display:"flex", gap:6, alignItems:"center" }}>
            <span style={{ fontSize:10, color:"#64748b" }}>📶 🔋</span>
          </div>
        </div>

        {/* Top bar */}
        <div style={{ background:"#07101f", borderBottom:"1px solid #1e3a6e20", padding:"10px 20px 12px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <Avatar nombre={LIDER.nombre} size={34} color="#f59e0b"/>
            <div>
              <div style={{ fontSize:12, fontWeight:800, color:"#fff" }}>{LIDER.nombre}</div>
              <div style={{ fontSize:9, color:"#475569" }}>{LIDER.tipo==="urbano"?"🏙️":"🌿"} {LIDER.zona.length > 26 ? LIDER.zona.slice(0,26)+"…" : LIDER.zona}</div>
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <div style={{ background:"#f59e0b18", border:"1px solid #f59e0b40", borderRadius:8, padding:"4px 10px" }}>
              <span style={{ fontSize:10, fontWeight:800, color:"#f59e0b" }}>{votantes.length} votantes</span>
            </div>
            <button onClick={handleLogout} title="Cerrar sesión"
              style={{ background:"#ef444420", border:"1px solid #ef444444", borderRadius:8, padding:"4px 8px", color:"#ef4444", fontSize:11, cursor:"pointer" }}>
              ⏏
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex:1, overflowY:"auto" }}>
          {screen==="home"     && <ScreenHome     votantes={votantes} onNav={s=>nav(s)}/>}
          {screen==="votantes" && <ScreenVotantes votantes={votantes} onEdit={v=>nav("detalle",v)} onSelect={v=>{setSelected(v);setScreen("detalle");}}/>}
          {screen==="detalle"  && selected && <ScreenDetalle votante={selected} onBack={()=>setScreen("votantes")} onUpdate={updateVotante} onNovedad={v=>nav("novedad",v)}/>}
          {screen==="agregar"  && <ScreenAgregar onSave={addVotante} onBack={()=>setScreen("home")}/>}
          {screen==="novedad"  && <ScreenNovedad votante={novedadVot} onBack={()=>setScreen(novedadVot?"detalle":"home")} onSend={()=>{}}/>}
          {screen==="mensaje"  && <ScreenMensaje votantes={votantes} onBack={()=>setScreen("home")}/>}
        </div>

        {/* Bottom nav */}
        <div style={{
          background:"#07101f",
          borderTop:"1px solid #1e3a6e30",
          display:"flex",
          padding:"8px 0 16px",
          position:"sticky",
          bottom:0,
        }}>
          {BNAV.map(t=>{
            const active = screen===t.id || (t.id==="votantes" && screen==="detalle");
            return (
              <button key={t.id} onClick={()=>nav(t.id)}
                style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:3,
                  background:"none", border:"none", cursor:"pointer", padding:"4px 0" }}>
                <div style={{
                  width:36, height:36, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center",
                  background: active ? "#3b82f620" : "transparent",
                  transition:"all .2s",
                }}>
                  <span style={{ fontSize:18 }}>{t.icon}</span>
                </div>
                <span style={{ fontSize:9, fontWeight: active ? 800 : 500, color: active ? "#3b82f6" : "#334155" }}>
                  {t.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
