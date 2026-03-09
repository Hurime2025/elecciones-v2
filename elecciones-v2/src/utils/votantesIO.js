// ═══════════════════════════════════════════════════════════════
// VOTOCONTROL PRO — Import / Export de Votantes
// Formato CSV con separador de coma. Valores múltiples con pipe |
// ═══════════════════════════════════════════════════════════════

// Columnas oficiales del formato
export const COLUMNAS = [
  { key:"nombre",     label:"nombre",     required:true,  desc:"Nombre completo del votante" },
  { key:"cedula",     label:"cedula",     required:true,  desc:"Número de cédula (solo dígitos)" },
  { key:"phone",      label:"phone",      required:true,  desc:"Teléfono / WhatsApp (10 dígitos)" },
  { key:"barrio",     label:"barrio",     required:false, desc:"Barrio o vereda" },
  { key:"puesto",     label:"puesto",     required:false, desc:"Nombre del puesto de votación" },
  { key:"mesa",       label:"mesa",       required:false, desc:"Número de mesa" },
  { key:"liderIds",   label:"liderIds",   required:false, desc:"IDs de líderes separados por | (ej. L-01|L-02)" },
  { key:"campanas",   label:"campanas",   required:false, desc:"IDs de campañas separados por | (ej. GOB|C-01|C-04)" },
  { key:"estado_GOB", label:"estado_GOB", required:false, desc:"confirmado | pendiente | no_contactado" },
];

const HEADER = COLUMNAS.map(c => c.key).join(",");

const ESTADOS_VALIDOS = ["confirmado", "pendiente", "no_contactado"];

// ─── EXPORTAR ──────────────────────────────────────────────────
/**
 * Convierte un array de votantes al contenido de un archivo CSV.
 */
export function votantesToCSV(votantes) {
  const rows = votantes.map(v => {
    const campanas = (v.campañas ?? []).join("|");
    const liderIds = (v.liderIds  ?? []).join("|");
    const estadoGOB = v.estado?.["GOB"] ?? "no_contactado";

    return [
      csvCell(v.nombre),
      csvCell(v.cedula),
      csvCell(v.phone),
      csvCell(v.barrio  ?? ""),
      csvCell(v.puesto  ?? ""),
      csvCell(v.mesa    ?? ""),
      csvCell(liderIds),
      csvCell(campanas),
      csvCell(estadoGOB),
    ].join(",");
  });

  return [HEADER, ...rows].join("\r\n");
}

/** Envuelve en comillas si el valor contiene coma, comilla o salto de línea */
function csvCell(value) {
  const str = String(value ?? "");
  return str.includes(",") || str.includes('"') || str.includes("\n")
    ? `"${str.replace(/"/g, '""')}"`
    : str;
}

/** Dispara la descarga del CSV en el navegador */
export function descargarCSV(contenido, nombreArchivo) {
  const BOM = "\uFEFF"; // UTF-8 BOM para que Excel lo abra correctamente
  const blob = new Blob([BOM + contenido], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href     = url;
  link.download = nombreArchivo;
  link.click();
  URL.revokeObjectURL(url);
}

// ─── PLANTILLA ─────────────────────────────────────────────────
/** Genera y descarga la plantilla vacía con filas de ejemplo */
export function descargarPlantilla() {
  const ejemplos = [
    ["María González López", "10234567", "3001112233", "Centro", "IE Simón Bolívar", "12", "L-01", "GOB|C-01", "confirmado"],
    ["Juan Rodríguez Pérez", "10345678", "3112223344", "Las Américas", "IE Politécnico", "07", "L-02", "GOB|C-01", "pendiente"],
    ["Carmen Jiménez Ruiz",  "10456789", "3223334455", "El Palmar",    "IE Rural",       "03", "L-03", "GOB",     "no_contactado"],
  ].map(row => row.map(csvCell).join(","));

  const instrucciones = [
    "# INSTRUCCIONES DE IMPORTACIÓN — VotoControl Pro",
    "# - No borres ni modifiques la fila de encabezados (fila 1).",
    "# - Las columnas 'nombre', 'cedula' y 'phone' son OBLIGATORIAS.",
    "# - Separador de valores múltiples (liderIds, campanas): el carácter pipe |",
    "# - IDs de campañas válidos: GOB (Gobernador), C-01 … C-08 (Candidatos).",
    "# - IDs de líderes válidos: L-01 … L-08.",
    "# - estado_GOB válidos: confirmado | pendiente | no_contactado",
    "# - Cédulas duplicadas serán ignoradas en la importación.",
    "# - Guarda como CSV con codificación UTF-8 antes de importar.",
    "#",
    "# Elimina estas líneas de comentario antes de importar si tu Excel las incluye.",
    HEADER,
    ...ejemplos,
  ];

  descargarCSV(instrucciones.join("\r\n"), "plantilla_votantes_votocontrol.csv");
}

// ─── IMPORTAR ──────────────────────────────────────────────────
/**
 * Lee el texto de un archivo CSV y retorna:
 * { validos: [], errores: [], duplicados: [] }
 */
export function parsearCSV(texto, votantesExistentes = []) {
  const lineas = texto
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .map(l => l.trim())
    .filter(l => l && !l.startsWith("#")); // ignorar comentarios y vacías

  if (lineas.length === 0) return { validos:[], errores:[{ fila:0, msg:"El archivo está vacío." }], duplicados:[] };

  // Detectar encabezado
  const encabezado = parsearFila(lineas[0]).map(h => h.toLowerCase().trim());
  const idxNombre  = encabezado.indexOf("nombre");
  const idxCedula  = encabezado.indexOf("cedula");
  const idxPhone   = encabezado.indexOf("phone");

  if (idxNombre < 0 || idxCedula < 0 || idxPhone < 0) {
    return {
      validos: [],
      errores: [{ fila:1, msg:"Encabezado inválido. Asegúrate de usar la plantilla oficial." }],
      duplicados: [],
    };
  }

  const idx = (key) => encabezado.indexOf(key);

  const cedulasExistentes = new Set(votantesExistentes.map(v => v.cedula?.trim()));
  const cedulasEnArchivo  = new Set();

  const validos    = [];
  const errores    = [];
  const duplicados = [];

  for (let i = 1; i < lineas.length; i++) {
    const fila   = i + 1;
    const campos = parsearFila(lineas[i]);
    const get    = (key) => (campos[idx(key)] ?? "").trim();

    const nombre  = get("nombre");
    const cedula  = get("cedula");
    const phone   = get("phone");

    // Validaciones
    const errs = [];
    if (!nombre)              errs.push("nombre obligatorio");
    if (!cedula)              errs.push("cédula obligatoria");
    else if (!/^\d+$/.test(cedula)) errs.push("cédula debe contener solo dígitos");
    if (!phone)               errs.push("teléfono obligatorio");

    if (errs.length > 0) { errores.push({ fila, nombre: nombre||"(sin nombre)", msg: errs.join(", ") }); continue; }

    // Duplicados
    if (cedulasExistentes.has(cedula) || cedulasEnArchivo.has(cedula)) {
      duplicados.push({ fila, nombre, cedula }); continue;
    }
    cedulasEnArchivo.add(cedula);

    // Estado GOB
    const estadoRaw = get("estado_gob");
    const estadoGOB = ESTADOS_VALIDOS.includes(estadoRaw) ? estadoRaw : "no_contactado";

    // Campañas y líderes
    const campanas = get("campanas")
      ? get("campanas").split("|").map(s=>s.trim()).filter(Boolean)
      : ["GOB"];
    const liderIds = get("liderids")
      ? get("liderids").split("|").map(s=>s.trim()).filter(Boolean)
      : [];

    // Construir estado por campaña
    const estado = {};
    campanas.forEach(cId => { estado[cId] = cId === "GOB" ? estadoGOB : "no_contactado"; });

    validos.push({
      nombre,
      cedula,
      phone,
      barrio:    get("barrio")  || "",
      puesto:    get("puesto")  || "",
      mesa:      get("mesa")    || "",
      liderIds,
      campañas:  campanas,
      estado,
    });
  }

  return { validos, errores, duplicados };
}

/** Parsea una fila CSV respetando comillas */
function parsearFila(linea) {
  const resultado = [];
  let campo = "";
  let dentroComillas = false;

  for (let i = 0; i < linea.length; i++) {
    const c = linea[i];
    if (c === '"') {
      if (dentroComillas && linea[i+1] === '"') { campo += '"'; i++; }
      else dentroComillas = !dentroComillas;
    } else if (c === "," && !dentroComillas) {
      resultado.push(campo); campo = "";
    } else {
      campo += c;
    }
  }
  resultado.push(campo);
  return resultado;
}
