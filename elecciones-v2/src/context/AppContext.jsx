import { createContext, useContext, useState } from "react";

// ═══════════════════════════════════════════════════════
// DATA INICIAL
// ═══════════════════════════════════════════════════════
const GOBERNADOR_INIT = {
  id: "GOB-1", nombre: "Eduardo Padilla Díaz", cargo: "Gobernador",
  depto: "Sucre", color: "#f59e0b", meta: 55000,
};

const CANDIDATOS_INIT = [
  { id:"C-01", nombre:"Carlos Martínez Ruiz",   cargo:"Alcalde",     municipio:"Sincelejo",  color:"#3b82f6", meta:16000 },
  { id:"C-02", nombre:"Yenis Álvarez Torres",   cargo:"Alcalde",     municipio:"Corozal",    color:"#06b6d4", meta:10000 },
  { id:"C-03", nombre:"Hernando Soto Luna",     cargo:"Alcalde",     municipio:"San Marcos", color:"#0ea5e9", meta:7500  },
  { id:"C-04", nombre:"Rosa Mendoza Pérez",     cargo:"Concejal",    municipio:"Sincelejo",  color:"#10b981", meta:4000  },
  { id:"C-05", nombre:"Álvaro Díaz Herrera",    cargo:"Concejal",    municipio:"Sincelejo",  color:"#34d399", meta:3500  },
  { id:"C-06", nombre:"Marta Salas Quintero",   cargo:"Concejal",    municipio:"Corozal",    color:"#6ee7b7", meta:2200  },
  { id:"C-07", nombre:"Jorge Ríos Castellanos", cargo:"Asambleísta", municipio:"Sucre",      color:"#a78bfa", meta:6500  },
  { id:"C-08", nombre:"Lina Cure Montoya",      cargo:"Asambleísta", municipio:"Sucre",      color:"#c4b5fd", meta:5000  },
];

const LIDERES_INIT = [
  { id:"L-01", nombre:"Franklyn Torres",    tipo:"urbano", zona:"Com. 1 – Centro",        candidatoId:"C-01", phone:"3001234567" },
  { id:"L-02", nombre:"Esperanza Jiménez", tipo:"urbano", zona:"Com. 2 – Las Américas",  candidatoId:"C-01", phone:"3107654321" },
  { id:"L-03", nombre:"Reinaldo Pacheco",  tipo:"rural",  zona:"Vereda El Palmar",        candidatoId:"C-01", phone:"3204567890" },
  { id:"L-04", nombre:"Carmen Suárez",     tipo:"rural",  zona:"Vereda La Unión",         candidatoId:"C-02", phone:"3156789012" },
  { id:"L-05", nombre:"Julio César Reyes", tipo:"urbano", zona:"Com. 3 – Venecia",        candidatoId:"C-04", phone:"3008901234" },
  { id:"L-06", nombre:"Patricia Angarita", tipo:"rural",  zona:"Vereda San Pedro",        candidatoId:"C-07", phone:"3123456789" },
  { id:"L-07", nombre:"Deimer Herrera",    tipo:"urbano", zona:"Com. 4 – Villa Olímpica", candidatoId:"C-01", phone:"3209871234" },
  { id:"L-08", nombre:"Nubia Cassiani",    tipo:"rural",  zona:"Vereda Palo Alto",        candidatoId:"C-03", phone:"3145678901" },
];

const VOTANTES_INIT = [
  { id:"V-001", nombre:"María González",    cedula:"10234567", phone:"3001112233", barrio:"Centro",         puesto:"IE Simón Bolívar", mesa:"12", liderIds:["L-01"], campañas:["C-01","C-04","GOB"], estado:{"C-01":"confirmado","C-04":"pendiente","GOB":"confirmado"} },
  { id:"V-002", nombre:"Juan Rodríguez",    cedula:"10345678", phone:"3112223344", barrio:"Las Américas",   puesto:"IE Simón Bolívar", mesa:"07", liderIds:["L-02"], campañas:["C-01","GOB"],        estado:{"C-01":"pendiente","GOB":"pendiente"} },
  { id:"V-003", nombre:"Carmen Jiménez",    cedula:"10456789", phone:"3223334455", barrio:"Centro",         puesto:"IE La Esperanza",  mesa:"03", liderIds:["L-01"], campañas:["C-01","C-04","C-07","GOB"], estado:{"C-01":"confirmado","C-04":"confirmado","C-07":"pendiente","GOB":"confirmado"} },
  { id:"V-004", nombre:"Pedro Álvarez",     cedula:"10567890", phone:"3334445566", barrio:"Las Américas",   puesto:"IE Politécnico",   mesa:"21", liderIds:["L-02"], campañas:["C-01","GOB"],        estado:{"C-01":"no_contactado","GOB":"pendiente"} },
  { id:"V-005", nombre:"Rosa Martínez",     cedula:"10678901", phone:"3001234567", barrio:"Venecia",        puesto:"IE Simón Bolívar", mesa:"15", liderIds:["L-05","L-01"], campañas:["C-01","C-04","GOB"], estado:{"C-01":"confirmado","C-04":"confirmado","GOB":"confirmado"} },
  { id:"V-006", nombre:"Luis Hernández",    cedula:"10789012", phone:"3123456789", barrio:"El Palmar",      puesto:"IE Rural",         mesa:"02", liderIds:["L-03"], campañas:["C-01","GOB"],        estado:{"C-01":"confirmado","GOB":"confirmado"} },
  { id:"V-007", nombre:"Ana Pérez Díaz",    cedula:"10890123", phone:"3145678901", barrio:"La Unión",       puesto:"IE Corozal",       mesa:"08", liderIds:["L-04"], campañas:["C-02","C-06","GOB"], estado:{"C-02":"confirmado","C-06":"pendiente","GOB":"confirmado"} },
  { id:"V-008", nombre:"Jorge Herrera",     cedula:"10901234", phone:"3156789012", barrio:"San Pedro",      puesto:"IE Rural 2",       mesa:"01", liderIds:["L-06"], campañas:["C-07","GOB"],        estado:{"C-07":"confirmado","GOB":"confirmado"} },
  { id:"V-009", nombre:"Luz Marina Castro", cedula:"11012345", phone:"3167890123", barrio:"Palo Alto",      puesto:"IE Rural 3",       mesa:"05", liderIds:["L-08"], campañas:["C-03","GOB"],        estado:{"C-03":"pendiente","GOB":"pendiente"} },
  { id:"V-010", nombre:"Iván Díaz Polo",    cedula:"11123456", phone:"3178901234", barrio:"Villa Olímpica", puesto:"IE Politécnico",   mesa:"18", liderIds:["L-07"], campañas:["C-01","C-04","GOB"], estado:{"C-01":"confirmado","C-04":"confirmado","GOB":"confirmado"} },
  { id:"V-011", nombre:"Sandra López",      cedula:"11234567", phone:"3189012345", barrio:"Centro",         puesto:"IE Simón Bolívar", mesa:"11", liderIds:["L-01","L-05"], campañas:["C-01","C-04","GOB"], estado:{"C-01":"confirmado","C-04":"no_contactado","GOB":"confirmado"} },
  { id:"V-012", nombre:"Carlos Ruiz Ortiz", cedula:"11345678", phone:"3190123456", barrio:"Las Américas",   puesto:"IE La Esperanza",  mesa:"04", liderIds:["L-02"], campañas:["C-01","GOB"],        estado:{"C-01":"no_contactado","GOB":"no_contactado"} },
];

// Usuarios del sistema: quiénes pueden ingresar a VotoControl Pro
const USUARIOS_INIT = [
  { id:"U-001", nombre:"Eduardo Padilla Díaz",   rol:"gobernador",  email:"epadilla@sucre.gov.co",    phone:"3001000001", activo:true,  refId:"GOB-1" },
  { id:"U-002", nombre:"Carlos Martínez Ruiz",   rol:"candidato",   email:"cmartinez@campana.co",     phone:"3001000002", activo:true,  refId:"C-01" },
  { id:"U-003", nombre:"Yenis Álvarez Torres",   rol:"candidato",   email:"yalvarez@campana.co",      phone:"3001000003", activo:true,  refId:"C-02" },
  { id:"U-004", nombre:"Hernando Soto Luna",     rol:"candidato",   email:"hsoto@campana.co",         phone:"3001000004", activo:true,  refId:"C-03" },
  { id:"U-005", nombre:"Rosa Mendoza Pérez",     rol:"candidato",   email:"rmendoza@campana.co",      phone:"3001000005", activo:true,  refId:"C-04" },
  { id:"U-006", nombre:"Álvaro Díaz Herrera",    rol:"candidato",   email:"adiaz@campana.co",         phone:"3001000006", activo:false, refId:"C-05" },
  { id:"U-007", nombre:"Marta Salas Quintero",   rol:"candidato",   email:"msalas@campana.co",        phone:"3001000007", activo:true,  refId:"C-06" },
  { id:"U-008", nombre:"Jorge Ríos Castellanos", rol:"candidato",   email:"jrios@campana.co",         phone:"3001000008", activo:true,  refId:"C-07" },
  { id:"U-009", nombre:"Lina Cure Montoya",      rol:"candidato",   email:"lcure@campana.co",         phone:"3001000009", activo:true,  refId:"C-08" },
  { id:"U-010", nombre:"Franklyn Torres",        rol:"lider",       email:"ftorres@red.co",           phone:"3001234567", activo:true,  refId:"L-01" },
  { id:"U-011", nombre:"Esperanza Jiménez",      rol:"lider",       email:"ejimenez@red.co",          phone:"3107654321", activo:true,  refId:"L-02" },
  { id:"U-012", nombre:"Reinaldo Pacheco",       rol:"lider",       email:"rpacheco@red.co",          phone:"3204567890", activo:true,  refId:"L-03" },
  { id:"U-013", nombre:"Carmen Suárez",          rol:"lider",       email:"csuarez@red.co",           phone:"3156789012", activo:true,  refId:"L-04" },
  { id:"U-014", nombre:"Julio César Reyes",      rol:"lider",       email:"jcreyes@red.co",           phone:"3008901234", activo:false, refId:"L-05" },
  { id:"U-015", nombre:"Patricia Angarita",      rol:"lider",       email:"pangarita@red.co",         phone:"3123456789", activo:true,  refId:"L-06" },
  { id:"U-016", nombre:"Deimer Herrera",         rol:"lider",       email:"dherrera@red.co",          phone:"3209871234", activo:true,  refId:"L-07" },
  { id:"U-017", nombre:"Nubia Cassiani",         rol:"lider",       email:"ncassiani@red.co",         phone:"3145678901", activo:true,  refId:"L-08" },
];

// ═══════════════════════════════════════════════════════
// CONTEXT
// ═══════════════════════════════════════════════════════
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [gobernador]           = useState(GOBERNADOR_INIT);
  const [candidatos, setCandidatos] = useState(CANDIDATOS_INIT);
  const [lideres,    setLideres]    = useState(LIDERES_INIT);
  const [votantes,   setVotantes]   = useState(VOTANTES_INIT);
  const [usuarios,   setUsuarios]   = useState(USUARIOS_INIT);
  const [currentUser, setCurrentUser] = useState(null);

  // ── AUTH ─────────────────────────────────────────────
  // Contraseña demo universal: voto2027
  const DEMO_PASSWORD = "voto2027";
  const login = (email, password) => {
    if (password !== DEMO_PASSWORD) return { ok: false, error: "Contraseña incorrecta" };
    const user = usuarios.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user)    return { ok: false, error: "Usuario no encontrado" };
    if (!user.activo) return { ok: false, error: "Cuenta inactiva. Contacte al administrador." };
    setCurrentUser(user);
    return { ok: true, user };
  };
  const logout = () => setCurrentUser(null);

  // ── CANDIDATOS ──────────────────────────────────────
  const addCandidato    = (c)  => setCandidatos(p => [...p, { ...c, id:`C-${String(Date.now()).slice(-4)}` }]);
  const updateCandidato = (c)  => setCandidatos(p => p.map(x => x.id === c.id ? c : x));
  const deleteCandidato = (id) => setCandidatos(p => p.filter(x => x.id !== id));

  // ── LÍDERES ─────────────────────────────────────────
  const addLider    = (l)  => setLideres(p => [...p, { ...l, id:`L-${String(Date.now()).slice(-4)}` }]);
  const updateLider = (l)  => setLideres(p => p.map(x => x.id === l.id ? l : x));
  const deleteLider = (id) => setLideres(p => p.filter(x => x.id !== id));

  // ── VOTANTES ─────────────────────────────────────────
  const addVotante = (v) => {
    const id = `V-${String(Date.now()).slice(-4)}`;
    setVotantes(p => [...p, { ...v, id, estado: {} }]);
  };
  const updateVotante = (v) => setVotantes(p => p.map(x => x.id === v.id ? v : x));
  const deleteVotante = (id) => setVotantes(p => p.filter(x => x.id !== id));

  // ── USUARIOS ─────────────────────────────────────────
  const addUsuario    = (u)  => setUsuarios(p => [...p, { ...u, id:`U-${String(Date.now()).slice(-4)}` }]);
  const updateUsuario = (u)  => setUsuarios(p => p.map(x => x.id === u.id ? u : x));
  const deleteUsuario = (id) => setUsuarios(p => p.filter(x => x.id !== id));
  const toggleActivo  = (id) => setUsuarios(p => p.map(x => x.id === id ? { ...x, activo: !x.activo } : x));

  return (
    <AppContext.Provider value={{
      gobernador,
      candidatos, addCandidato, updateCandidato, deleteCandidato,
      lideres,    addLider,    updateLider,    deleteLider,
      votantes,   addVotante,  updateVotante,  deleteVotante,
      usuarios,   addUsuario,  updateUsuario,  deleteUsuario, toggleActivo,
      currentUser, login, logout,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
