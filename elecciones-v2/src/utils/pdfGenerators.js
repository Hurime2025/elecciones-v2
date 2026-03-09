// ═══════════════════════════════════════════════════════
// PDF GENERATORS — jsPDF + autotable
// ═══════════════════════════════════════════════════════
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ESTADO_LABEL, sanitizeFilename } from "./reportesHelper";

// ─── Paleta ────────────────────────────────────────────
const C = {
  bg:      [6,  12,  26],   // #060c1a
  panel:   [13, 27,  62],   // #0d1b3e
  border:  [30, 58, 110],   // #1e3a6e
  gold:    [245,158, 11],   // #f59e0b
  blue:    [59, 130,246],   // #3b82f6
  green:   [16, 185,129],   // #10b981
  amber:   [245,158, 11],   // #f59e0b
  gray:    [107,114,128],   // #6b7280
  red:     [239, 68, 68],   // #ef4444
  white:   [255,255,255],
  muted:   [148,163,184],   // #94a3b8
  dark:    [71, 85,105],    // #475569
};

const ESTADO_COLOR = {
  confirmado:    C.green,
  pendiente:     C.amber,
  no_contactado: C.gray,
};

// ─── Helpers internos ──────────────────────────────────
function addHeader(doc, titulo, subtitulo, fecha) {
  const W = doc.internal.pageSize.getWidth();
  // Fondo oscuro header
  doc.setFillColor(...C.bg);
  doc.rect(0, 0, W, 28, "F");
  // Línea dorada inferior
  doc.setFillColor(...C.gold);
  doc.rect(0, 28, W, 1.2, "F");
  // Textos
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...C.white);
  doc.text("VotoControl Pro", 14, 11);
  doc.setFontSize(8);
  doc.setTextColor(...C.gold);
  doc.text(titulo.toUpperCase(), 14, 18);
  doc.setTextColor(...C.muted);
  doc.setFont("helvetica", "normal");
  doc.text(subtitulo, 14, 23.5);
  // Fecha a la derecha
  doc.setFontSize(8);
  doc.setTextColor(...C.dark);
  doc.text(`Generado: ${fecha}`, W - 14, 23.5, { align:"right" });
}

function addResumen(doc, { total, confirmados, pendientes, sinContacto, pct }, startY) {
  const W = doc.internal.pageSize.getWidth();
  const cols = [
    { label:"TOTAL",        value: total,        color: C.muted  },
    { label:"CONFIRMADOS",  value: confirmados,  color: C.green  },
    { label:"PENDIENTES",   value: pendientes,   color: C.amber  },
    { label:"SIN CONTACTO", value: sinContacto,  color: C.gray   },
  ];
  const cw = (W - 28) / 4;
  cols.forEach((c, i) => {
    const x = 14 + i * cw;
    doc.setFillColor(...C.panel);
    doc.roundedRect(x, startY, cw - 3, 18, 2, 2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(...c.color);
    doc.text(String(c.value), x + (cw - 3) / 2, startY + 10, { align:"center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6);
    doc.setTextColor(...C.dark);
    doc.text(c.label, x + (cw - 3) / 2, startY + 15.5, { align:"center" });
  });
  // Barra de progreso
  const barY = startY + 21;
  doc.setFillColor(...C.border);
  doc.roundedRect(14, barY, W - 28, 4, 1.5, 1.5, "F");
  if (pct > 0) {
    doc.setFillColor(...C.green);
    doc.roundedRect(14, barY, ((W - 28) * pct) / 100, 4, 1.5, 1.5, "F");
  }
  doc.setFontSize(7);
  doc.setTextColor(...C.green);
  doc.setFont("helvetica", "bold");
  doc.text(`${pct}% confirmados`, W - 14, barY + 3.2, { align:"right" });
  return barY + 8; // nextY
}

function addFooter(doc) {
  const pages = doc.internal.getNumberOfPages();
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFillColor(...C.bg);
    doc.rect(0, H - 10, W, 10, "F");
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...C.dark);
    doc.text("VotoControl Pro — Documento confidencial", 14, H - 4);
    doc.text(`Página ${i} / ${pages}`, W - 14, H - 4, { align:"right" });
  }
}

function estadoStyle(data) {
  if (data.section !== "body") return;
  const col = data.column.index;
  const raw = data.cell.raw;
  // última columna = estado
  if (col === data.table.columns.length - 1) {
    const color = ESTADO_COLOR[raw] ?? C.muted;
    data.cell.styles.textColor = color;
    data.cell.styles.fontStyle = "bold";
    data.cell.text = [ESTADO_LABEL[raw] ?? raw];
  }
}

// ─── Reporte por Líder ─────────────────────────────────
export function generarPDFReporteLider(datos) {
  const doc = new jsPDF({ orientation:"portrait", unit:"mm", format:"a4" });
  const W = doc.internal.pageSize.getWidth();

  addHeader(
    doc,
    "Reporte por Líder",
    `${datos.lider.nombre}  ·  ${datos.candidato.cargo}: ${datos.candidato.nombre}`,
    datos.fecha
  );

  // Info del líder
  let y = 34;
  doc.setFillColor(...C.panel);
  doc.roundedRect(14, y, W - 28, 20, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...C.white);
  doc.text(datos.lider.nombre, 20, y + 8);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...C.muted);
  doc.text(`Zona: ${datos.lider.zona}`, 20, y + 13);
  doc.text(`📱 ${datos.lider.phone}`, 20, y + 18);
  doc.setTextColor(...C.blue);
  doc.setFont("helvetica", "bold");
  doc.text(`Campaña: ${datos.candidato.nombre} (${datos.candidato.cargo})`, W / 2, y + 11, { align:"center" });
  doc.setTextColor(...C.dark);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.text(`Tipo: ${datos.lider.tipo === "urbano" ? "Urbano 🏙️" : "Rural 🌿"}`, W - 20, y + 18, { align:"right" });

  y += 24;
  // Resumen KPIs
  y = addResumen(doc, datos.resumen, y) + 4;

  // Tabla de votantes
  autoTable(doc, {
    startY: y,
    head: [["Nombre", "Cédula", "Barrio", "Puesto de Votación", "Mesa", "Estado"]],
    body: datos.votantes.map(v => [v.nombre, v.cedula, v.barrio, v.puesto, v.mesa, v.estado]),
    styles:         { font:"helvetica", fontSize:8, cellPadding:2.5, textColor: C.muted },
    headStyles:     { fillColor: C.bg, textColor: C.dark, fontStyle:"bold", fontSize:7.5 },
    alternateRowStyles: { fillColor: C.panel },
    rowPageBreak:   "auto",
    didParseCell:   estadoStyle,
    margin:         { left:14, right:14 },
    tableLineColor: C.border,
    tableLineWidth: 0.1,
  });

  addFooter(doc);

  const fname = `reporte_lider_${sanitizeFilename(datos.lider.nombre)}_${datos.fecha.replace(/\//g,"-")}.pdf`;
  doc.save(fname);
}

// ─── Reporte por Puesto ────────────────────────────────
export function generarPDFReportePuesto(datos) {
  const doc = new jsPDF({ orientation:"portrait", unit:"mm", format:"a4" });
  const W = doc.internal.pageSize.getWidth();

  const campTitulo = datos.campId === "all"
    ? "Todas las campañas"
    : datos.candidato ? `${datos.candidato.cargo}: ${datos.candidato.nombre}` : "";

  addHeader(
    doc,
    "Reporte por Puesto de Votación",
    `${datos.puesto}  ·  ${campTitulo}`,
    datos.fecha
  );

  let y = 34;

  // Info puesto
  doc.setFillColor(...C.panel);
  doc.roundedRect(14, y, W - 28, 14, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...C.white);
  doc.text(datos.puesto, 20, y + 7);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...C.muted);
  doc.text(`Mesas: ${datos.resumen.totalMesas}  ·  Campaña: ${campTitulo}`, 20, y + 12);
  y += 18;

  // Resumen global
  y = addResumen(doc, datos.resumen, y) + 4;

  // Tabla resumen por mesa
  autoTable(doc, {
    startY: y,
    head: [["Mesa", "Total", "Confirmados", "Pendientes", "Sin Contacto"]],
    body: datos.mesas.map(m => [m.mesa, m.total, m.confirmados, m.pendientes, m.sinContacto]),
    styles:         { font:"helvetica", fontSize:8, cellPadding:2.5, textColor: C.muted, halign:"center" },
    headStyles:     { fillColor: C.bg, textColor: C.dark, fontStyle:"bold", fontSize:7.5 },
    columnStyles:   { 0:{ halign:"left" }, 2:{ textColor: C.green }, 3:{ textColor: C.amber }, 4:{ textColor: C.gray } },
    alternateRowStyles: { fillColor: C.panel },
    margin:         { left:14, right:14 },
    tableLineColor: C.border,
    tableLineWidth: 0.1,
  });

  // Detalle por mesa (una tabla por mesa)
  datos.mesas.forEach(m => {
    const lastY = doc.lastAutoTable.finalY + 8;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...C.gold);
    doc.text(`Mesa ${m.mesa}  (${m.total} votantes)`, 14, lastY);

    autoTable(doc, {
      startY: lastY + 3,
      head: [["Nombre", "Cédula", "Barrio", "Estado"]],
      body: m.votantes.map(v => [v.nombre, v.cedula, v.barrio, v.estado]),
      styles:         { font:"helvetica", fontSize:7.5, cellPadding:2, textColor: C.muted },
      headStyles:     { fillColor: [20, 38, 80], textColor: C.dark, fontStyle:"bold", fontSize:7 },
      alternateRowStyles: { fillColor: C.panel },
      didParseCell:   estadoStyle,
      margin:         { left:14, right:14 },
      tableLineColor: C.border,
      tableLineWidth: 0.1,
    });
  });

  addFooter(doc);

  const fname = `reporte_puesto_${sanitizeFilename(datos.puesto)}_${datos.fecha.replace(/\//g,"-")}.pdf`;
  doc.save(fname);
}
