// ═══════════════════════════════════════════════════════
// REPORTE HELPERS — funciones puras para calcular datos
// ═══════════════════════════════════════════════════════

const HOY = () => new Date().toLocaleDateString("es-CO", { day:"2-digit", month:"2-digit", year:"numeric" });

/** Resuelve campañas: acepta "campañas" o "campanas" */
const getCampañas = (v) => v.campañas ?? v.campanas ?? [];

/** Resuelve estado de un votante para una campaña dada */
const getEstado = (v, campId) => v.estado?.[campId] ?? "no_contactado";

/** Etiqueta legible del estado */
export const ESTADO_LABEL = {
  confirmado:    "Confirmado",
  pendiente:     "Pendiente",
  no_contactado: "Sin contacto",
};

// ─── Reporte por Líder ─────────────────────────────────
/**
 * Construye los datos para el reporte de un líder.
 * @param {string} liderId   - ID del líder
 * @param {string} campId    - ID de la campaña ("GOB" | "C-01" … )
 * @param {{ votantes, lideres, candidatos, gobernador }} ctx
 */
export function buildReportePorLider(liderId, campId, { votantes, lideres, candidatos, gobernador }) {
  const lider = lideres.find(l => l.id === liderId);
  if (!lider) return null;

  const candidato = campId === "GOB"
    ? { id:"GOB", nombre: gobernador.nombre, cargo:"Gobernador", municipio: gobernador.depto, color:"#f59e0b" }
    : candidatos.find(c => c.id === campId);
  if (!candidato) return null;

  // Votantes del líder EN esa campaña
  const lista = votantes
    .filter(v => (v.liderIds ?? []).includes(liderId) && getCampañas(v).includes(campId))
    .map(v => ({
      nombre:  v.nombre,
      cedula:  v.cedula,
      phone:   v.phone,
      barrio:  v.barrio  ?? "—",
      puesto:  v.puesto  ?? "—",
      mesa:    v.mesa    ?? "—",
      estado:  getEstado(v, campId),
    }))
    .sort((a, b) => a.nombre.localeCompare(b.nombre));

  const confirmados  = lista.filter(v => v.estado === "confirmado").length;
  const pendientes   = lista.filter(v => v.estado === "pendiente").length;
  const sinContacto  = lista.filter(v => v.estado === "no_contactado").length;
  const total        = lista.length;

  return {
    tipo: "lider",
    fecha: HOY(),
    lider: { id: lider.id, nombre: lider.nombre, tipo: lider.tipo, zona: lider.zona, phone: lider.phone },
    candidato: { id: candidato.id, nombre: candidato.nombre, cargo: candidato.cargo, municipio: candidato.municipio ?? "", color: candidato.color },
    votantes: lista,
    resumen: { total, confirmados, pendientes, sinContacto, pct: total ? Math.round((confirmados / total) * 100) : 0 },
  };
}

// ─── Reporte por Puesto ────────────────────────────────
/**
 * Construye los datos para el reporte de un puesto de votación.
 * @param {string} puesto  - nombre exacto del puesto
 * @param {string} campId  - "GOB" | "C-01" … | "all"
 * @param {{ votantes, candidatos, gobernador }} ctx
 */
export function buildReportePorPuesto(puesto, campId, { votantes, candidatos, gobernador }) {
  const candidato = campId === "all"
    ? null
    : campId === "GOB"
      ? { id:"GOB", nombre: gobernador.nombre, cargo:"Gobernador", color:"#f59e0b" }
      : candidatos.find(c => c.id === campId);

  // Filtrar por puesto y (opcionalmente) campaña
  const base = votantes.filter(v =>
    v.puesto === puesto &&
    (campId === "all" || getCampañas(v).includes(campId))
  );

  // Agrupar por mesa
  const mesaMap = new Map();
  base.forEach(v => {
    const m = v.mesa ?? "—";
    if (!mesaMap.has(m)) mesaMap.set(m, []);
    mesaMap.get(m).push({
      nombre: v.nombre,
      cedula: v.cedula,
      barrio: v.barrio ?? "—",
      estado: campId === "all" ? "—" : getEstado(v, campId),
    });
  });

  const mesas = [...mesaMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
    .map(([mesa, vots]) => {
      vots.sort((a, b) => a.nombre.localeCompare(b.nombre));
      const conf = vots.filter(v => v.estado === "confirmado").length;
      const pend = vots.filter(v => v.estado === "pendiente").length;
      const sc   = vots.filter(v => v.estado === "no_contactado").length;
      return { mesa, votantes: vots, total: vots.length, confirmados: conf, pendientes: pend, sinContacto: sc };
    });

  const totalVotantes  = base.length;
  const totalConf      = campId === "all" ? 0 : base.filter(v => getEstado(v, campId) === "confirmado").length;
  const totalPend      = campId === "all" ? 0 : base.filter(v => getEstado(v, campId) === "pendiente").length;
  const totalSC        = campId === "all" ? 0 : base.filter(v => getEstado(v, campId) === "no_contactado").length;

  return {
    tipo: "puesto",
    fecha: HOY(),
    puesto,
    campId,
    candidato,
    mesas,
    resumen: {
      totalMesas:    mesas.length,
      totalVotantes,
      confirmados:   totalConf,
      pendientes:    totalPend,
      sinContacto:   totalSC,
      pct: totalVotantes && campId !== "all" ? Math.round((totalConf / totalVotantes) * 100) : 0,
    },
  };
}

// ─── Utilidades ────────────────────────────────────────
/** Lista de puestos únicos ordenados */
export function getPuestosUnicos(votantes) {
  return [...new Set(votantes.map(v => v.puesto).filter(Boolean))].sort();
}

/** Quita tildes y caracteres especiales para nombres de archivo */
export function sanitizeFilename(str) {
  return (str ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9_\- ]/g, "")
    .trim()
    .replace(/\s+/g, "_");
}
