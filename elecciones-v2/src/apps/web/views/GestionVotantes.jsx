import { useState, useRef } from "react";
import { useApp } from "../../../context/AppContext";
import { votantesToCSV, descargarCSV, descargarPlantilla, parsearCSV } from "../../../utils/votantesIO";

const ESTADO_META = {
  confirmado:    { label:"Confirmado",    color:"#10b981", bg:"#10b98120" },
  pendiente:     { label:"Pendiente",     color:"#f59e0b", bg:"#f59e0b20" },
  no_contactado: { label:"Sin contacto",  color:"#6b7280", bg:"#6b728020" },
};

const BLANK_VOTANTE = {
  nombre:"", cedula:"", phone:"", barrio:"", puesto:"", mesa:"",
  liderIds:[], campañas:["GOB"], estado:{},
};

// ─── Modal: Votante ya existe con esa cédula ───────────────────
function ModalVotanteExistente({ votante, onClose }) {
  const { lideres, candidatos, gobernador } = useApp();
  const lidsAsig = lideres.filter(l => (votante.liderIds ?? []).includes(l.id));

  const nombreCampaña = (id) => {
    if (id === "GOB") return `${gobernador?.nombre ?? "Gobernador"} (Gobernador)`;
    const c = candidatos.find(x => x.id === id);
    return c ? `${c.nombre} (${c.cargo})` : id;
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"#00000098", zIndex:1200, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <div style={{ background:"#0d1b3e", border:"2px solid #f59e0b", borderRadius:18, width:440, padding:28 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:"#f59e0b", letterSpacing:".06em" }}>⚠ CÉDULA YA REGISTRADA</div>
            <h2 style={{ margin:"4px 0 0", fontSize:16, fontWeight:800, color:"#fff" }}>Votante encontrado</h2>
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", color:"#64748b", fontSize:20, cursor:"pointer" }}>✕</button>
        </div>

        {/* Datos básicos */}
        <div style={{ background:"#060c1a", borderRadius:12, padding:16, marginBottom:14 }}>
          <div style={{ fontSize:16, fontWeight:800, color:"#fff", marginBottom:4 }}>{votante.nombre}</div>
          <div style={{ display:"flex", gap:20 }}>
            <span style={{ fontSize:12, color:"#94a3b8" }}>CC {votante.cedula}</span>
            <span style={{ fontSize:12, color:"#25d366" }}>📱 {votante.phone}</span>
          </div>
          {(votante.barrio || votante.puesto) && (
            <div style={{ fontSize:11, color:"#4b6080", marginTop:6 }}>
              {votante.barrio && <span>{votante.barrio}</span>}
              {votante.barrio && votante.puesto && <span> · </span>}
              {votante.puesto && <span>{votante.puesto} Mesa {votante.mesa}</span>}
            </div>
          )}
        </div>

        {/* Líder asignado */}
        <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:10, fontWeight:700, color:"#4b6080", marginBottom:6 }}>LÍDER ASIGNADO</div>
          {lidsAsig.length === 0
            ? <span style={{ fontSize:12, color:"#4b6080" }}>Sin líder</span>
            : lidsAsig.map(l => (
              <div key={l.id} style={{ background:"#3b82f615", border:"1px solid #3b82f633", borderRadius:8, padding:"7px 12px", marginBottom:4 }}>
                <span style={{ fontSize:12, fontWeight:700, color:"#3b82f6" }}>{l.nombre}</span>
                <span style={{ fontSize:11, color:"#4b6080", marginLeft:8 }}>{l.zona}</span>
              </div>
            ))
          }
        </div>

        {/* Campañas */}
        <div style={{ marginBottom:20 }}>
          <div style={{ fontSize:10, fontWeight:700, color:"#4b6080", marginBottom:6 }}>CAMPAÑAS ASIGNADAS</div>
          {(votante.campañas ?? []).length === 0
            ? <span style={{ fontSize:12, color:"#4b6080" }}>Sin campañas</span>
            : (votante.campañas ?? []).map(cId => {
              const est = votante.estado?.[cId] ?? "no_contactado";
              const em  = ESTADO_META[est];
              return (
                <div key={cId} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"5px 0", borderBottom:"1px solid #1e3a6e20" }}>
                  <span style={{ fontSize:12, color:"#e2e8f0" }}>{nombreCampaña(cId)}</span>
                  <span style={{ background:em.bg, color:em.color, border:`1px solid ${em.color}44`, borderRadius:12, padding:"2px 10px", fontSize:10, fontWeight:700 }}>
                    {em.label}
                  </span>
                </div>
              );
            })
          }
        </div>

        <div style={{ display:"flex", justifyContent:"flex-end" }}>
          <Btn onClick={onClose}>Entendido</Btn>
        </div>
      </div>
    </div>
  );
}

// ─── Modal Formulario Votante ──────────────────────────────────
function ModalVotante({ votante, onSave, onClose }) {
  const { lideres, candidatos, votantes } = useApp();
  const [form, setForm] = useState(votante ?? BLANK_VOTANTE);
  const [dupVotante, setDupVotante] = useState(null); // cédula duplicada encontrada
  const [showDup,    setShowDup]    = useState(false);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  // Verificar cédula duplicada al escribir
  const handleCedulaChange = (e) => {
    const cedula = e.target.value;
    set("cedula", cedula);
    if (cedula.length >= 5) {
      const dup = votantes.find(v => v.cedula?.trim() === cedula.trim() && v.id !== votante?.id);
      setDupVotante(dup ?? null);
      if (dup) setShowDup(true); // abrir modal automáticamente
    } else {
      setDupVotante(null);
    }
  };

  // Solo 1 líder por votante
  const selectLider = (id) => {
    const cur = form.liderIds ?? [];
    set("liderIds", cur[0] === id ? [] : [id]);
  };

  // Solo 1 candidato por cargo (Alcalde, Concejal, Asambleísta)
  const selectCampaña = (id, cargo) => {
    const cur = form.campañas ?? [];
    if (id === "GOB") {
      // Gobernador: toggle simple
      set("campañas", cur.includes("GOB") ? cur.filter(x => x !== "GOB") : [...cur, "GOB"]);
    } else {
      // Por cargo: deseleccionar cualquier otro del mismo tipo antes de seleccionar
      const mismoCargo = candidatos.filter(c => c.cargo === cargo).map(c => c.id);
      if (cur.includes(id)) {
        set("campañas", cur.filter(x => x !== id));
      } else {
        set("campañas", [...cur.filter(x => !mismoCargo.includes(x)), id]);
      }
    }
  };

  // Grupos de campañas para renderizar en secciones
  const grupos = [
    { cargo:"GOB",         label:"Gobernador",    badge:"Solo 1", color:"#f59e0b",
      items:[{ id:"GOB", nombre: "Gobernador Depto. Sucre" }] },
    { cargo:"Alcalde",     label:"Alcalde",        badge:"Solo 1", color:"#3b82f6",
      items: candidatos.filter(c => c.cargo === "Alcalde") },
    { cargo:"Concejal",    label:"Concejal",       badge:"Solo 1", color:"#10b981",
      items: candidatos.filter(c => c.cargo === "Concejal") },
    { cargo:"Asambleísta", label:"Asambleísta",    badge:"Solo 1", color:"#a78bfa",
      items: candidatos.filter(c => c.cargo === "Asambleísta") },
  ];

  const valid = form.nombre.trim() && form.cedula.trim() && form.phone.trim() && !dupVotante;

  return (
    <>
    <div style={{ position:"fixed", inset:0, background:"#00000090", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <div style={{ background:"#0d1b3e", border:"1px solid #1e3a6e", borderRadius:18, width:580, maxHeight:"90vh", overflowY:"auto", padding:28 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
          <h2 style={{ margin:0, fontSize:16, fontWeight:800, color:"#fff" }}>
            {votante ? "✏️ Editar votante" : "➕ Nuevo votante"}
          </h2>
          <button onClick={onClose} style={{ background:"none", border:"none", color:"#64748b", fontSize:20, cursor:"pointer" }}>✕</button>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
          {/* Cédula — primero para detectar duplicados al instante */}
          <div style={{ gridColumn:"1/-1" }}>
            <Field label="Número de cédula">
              <Input
                value={form.cedula}
                onChange={handleCedulaChange}
                placeholder="10234567"
                style={{ ...inputSt, borderColor: dupVotante ? "#ef4444" : "#1e3a6e" }}
              />
              {dupVotante && (
                <div style={{ marginTop:6, background:"#ef444415", border:"1px solid #ef444444", borderRadius:8, padding:"8px 12px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div>
                    <div style={{ fontSize:11, fontWeight:700, color:"#ef4444" }}>⚠ Cédula ya registrada</div>
                    <div style={{ fontSize:12, color:"#94a3b8", marginTop:2 }}>{dupVotante.nombre}</div>
                  </div>
                  <button onClick={() => setShowDup(true)} style={{ background:"#ef444420", border:"1px solid #ef444455", borderRadius:8, padding:"4px 10px", fontSize:11, fontWeight:700, color:"#ef4444", cursor:"pointer" }}>
                    Ver info →
                  </button>
                </div>
              )}
            </Field>
          </div>

          {/* Nombre completo */}
          <div style={{ gridColumn:"1/-1" }}>
            <Field label="Nombre completo">
              <Input value={form.nombre} onChange={e => set("nombre", e.target.value)} placeholder="Ej. María González López" />
            </Field>
          </div>

          {/* Teléfono */}
          <Field label="Teléfono / WhatsApp">
            <Input value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="3001234567" />
          </Field>

          {/* Barrio */}
          <Field label="Barrio / Vereda">
            <Input value={form.barrio} onChange={e => set("barrio", e.target.value)} placeholder="Ej. Centro" />
          </Field>

          {/* Mesa */}
          <Field label="Mesa de votación">
            <Input value={form.mesa} onChange={e => set("mesa", e.target.value)} placeholder="12" />
          </Field>

          {/* Puesto */}
          <div style={{ gridColumn:"1/-1" }}>
            <Field label="Puesto de votación">
              <Input value={form.puesto} onChange={e => set("puesto", e.target.value)} placeholder="Ej. IE Simón Bolívar" />
            </Field>
          </div>

          {/* Líder — solo 1 */}
          <div style={{ gridColumn:"1/-1" }}>
            <Field label="Líder asignado">
              <div style={{ fontSize:10, color:"#4b6080", marginBottom:6 }}>Solo 1 líder por votante</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                {lideres.map(l => {
                  const sel = (form.liderIds ?? [])[0] === l.id;
                  return (
                    <button key={l.id} onClick={() => selectLider(l.id)} style={{
                      padding:"5px 12px", borderRadius:20, fontSize:11, fontWeight:600, cursor:"pointer",
                      background: sel ? "#3b82f620" : "#060c1a",
                      border: `1px solid ${sel ? "#3b82f6" : "#1e3a6e"}`,
                      color: sel ? "#3b82f6" : "#64748b",
                    }}>
                      {sel ? "● " : "○ "}{l.nombre}
                    </button>
                  );
                })}
              </div>
            </Field>
          </div>

          {/* Campañas — agrupadas por cargo, solo 1 por tipo */}
          <div style={{ gridColumn:"1/-1" }}>
            <Field label="Campañas en que participa">
              <div style={{ display:"flex", flexDirection:"column", gap:12, marginTop:4 }}>
                {grupos.map(gr => (
                  <div key={gr.cargo}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                      <span style={{ fontSize:10, fontWeight:700, color:gr.color, letterSpacing:".05em" }}>{gr.label.toUpperCase()}</span>
                      <span style={{ fontSize:9, background:`${gr.color}15`, color:gr.color, border:`1px solid ${gr.color}44`, borderRadius:10, padding:"1px 7px", fontWeight:700 }}>{gr.badge}</span>
                    </div>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                      {gr.items.map(item => {
                        const sel = (form.campañas ?? []).includes(item.id);
                        return (
                          <button key={item.id} onClick={() => selectCampaña(item.id, gr.cargo)} style={{
                            padding:"5px 12px", borderRadius:20, fontSize:11, fontWeight:600, cursor:"pointer",
                            background: sel ? `${gr.color}20` : "#060c1a",
                            border: `1px solid ${sel ? gr.color : "#1e3a6e"}`,
                            color: sel ? gr.color : "#64748b",
                          }}>
                            {sel ? "● " : "○ "}{item.nombre}{item.municipio ? ` · ${item.municipio}` : ""}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </Field>
          </div>
        </div>

        <div style={{ display:"flex", gap:10, marginTop:24, justifyContent:"flex-end" }}>
          <Btn ghost onClick={onClose}>Cancelar</Btn>
          <Btn disabled={!valid} onClick={() => { if (valid) { onSave(form); onClose(); } }}>
            {votante ? "Guardar cambios" : "Registrar votante"}
          </Btn>
        </div>
      </div>
    </div>

    {/* Modal info de votante duplicado */}
    {showDup && dupVotante && (
      <ModalVotanteExistente votante={dupVotante} onClose={() => setShowDup(false)} />
    )}
    </>
  );
}

// ─── Detalle Votante (panel lateral) ──────────────────────────
function PanelDetalle({ votante, onClose, onEdit }) {
  const { lideres, candidatos } = useApp();
  const lidsAsig = lideres.filter(l => votante.liderIds?.includes(l.id));

  return (
    <div style={{
      position:"fixed", top:58, right:0, bottom:0, width:340,
      background:"#0d1b3e", borderLeft:"1px solid #1e3a6e", zIndex:200,
      overflowY:"auto", padding:24,
    }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:20 }}>
        <span style={{ fontSize:14, fontWeight:800, color:"#fff" }}>👤 Detalle</span>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={onEdit} style={{ ...accionSt, background:"#3b82f620", color:"#3b82f6", border:"1px solid #3b82f644" }}>✏️ Editar</button>
          <button onClick={onClose} style={{ background:"none", border:"none", color:"#64748b", fontSize:18, cursor:"pointer" }}>✕</button>
        </div>
      </div>

      <Row label="Nombre" value={votante.nombre} big />
      <Row label="Cédula" value={votante.cedula} />
      <Row label="Teléfono" value={
        <a href={`https://wa.me/57${votante.phone}`} target="_blank" rel="noreferrer"
          style={{ color:"#25d366", textDecoration:"none", fontSize:13 }}>
          📱 {votante.phone}
        </a>
      } />
      <Row label="Barrio" value={votante.barrio} />
      <Row label="Puesto" value={votante.puesto} />
      <Row label="Mesa" value={votante.mesa} />

      {/* Líderes */}
      <div style={{ marginTop:16 }}>
        <div style={{ fontSize:10, color:"#4b6080", fontWeight:700, marginBottom:8 }}>LÍDERES ASIGNADOS</div>
        {lidsAsig.length === 0
          ? <span style={{ fontSize:12, color:"#4b6080" }}>Sin líder asignado</span>
          : lidsAsig.map(l => (
            <div key={l.id} style={{ background:"#060c1a", borderRadius:8, padding:"8px 12px", marginBottom:6 }}>
              <div style={{ fontSize:12, fontWeight:700, color:"#e2e8f0" }}>{l.nombre}</div>
              <div style={{ fontSize:10, color:"#4b6080" }}>{l.zona}</div>
            </div>
          ))
        }
      </div>

      {/* Estado por campaña */}
      <div style={{ marginTop:16 }}>
        <div style={{ fontSize:10, color:"#4b6080", fontWeight:700, marginBottom:8 }}>ESTADO POR CAMPAÑA</div>
        {(votante.campañas ?? []).map(cId => {
          const est = votante.estado?.[cId] ?? "no_contactado";
          const em = ESTADO_META[est];
          const nombre = cId === "GOB"
            ? "Gobernador"
            : candidatos.find(c => c.id === cId)?.nombre ?? cId;
          return (
            <div key={cId} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
              <span style={{ fontSize:12, color:"#94a3b8" }}>{nombre}</span>
              <span style={{ background:em.bg, color:em.color, border:`1px solid ${em.color}44`, borderRadius:12, padding:"2px 10px", fontSize:11, fontWeight:700 }}>
                {em.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Row({ label, value, big }) {
  return (
    <div style={{ marginBottom:12 }}>
      <div style={{ fontSize:10, color:"#4b6080", fontWeight:700, marginBottom:2 }}>{label.toUpperCase()}</div>
      {big
        ? <div style={{ fontSize:16, fontWeight:800, color:"#fff" }}>{value}</div>
        : <div style={{ fontSize:13, color:"#94a3b8" }}>{value}</div>
      }
    </div>
  );
}

// ─── Confirm Eliminar ──────────────────────────────────────────
function ModalConfirm({ nombre, onConfirm, onClose }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"#00000090", zIndex:1100, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ background:"#0d1b3e", border:"1px solid #ef444455", borderRadius:16, padding:28, width:380 }}>
        <p style={{ color:"#fff", fontSize:15, fontWeight:700, margin:"0 0 8px" }}>¿Eliminar votante?</p>
        <p style={{ color:"#64748b", fontSize:13, margin:"0 0 20px" }}>
          Se eliminará <strong style={{ color:"#fff" }}>{nombre}</strong> del padrón. Esta acción no se puede deshacer.
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
// ─── Modal Importación ─────────────────────────────────────────
function ModalImportar({ votantesActuales, onImportar, onClose }) {
  const [resultado,  setResultado]  = useState(null); // { validos, errores, duplicados }
  const [importing,  setImporting]  = useState(false);
  const fileRef = useRef();

  const leerArchivo = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const texto = ev.target.result;
      const parsed = parsearCSV(texto, votantesActuales);
      setResultado(parsed);
    };
    reader.readAsText(file, "UTF-8");
  };

  const confirmarImport = () => {
    if (!resultado?.validos?.length) return;
    setImporting(true);
    onImportar(resultado.validos);
    onClose();
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"#00000090", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <div style={{ background:"#0d1b3e", border:"1px solid #1e3a6e", borderRadius:18, width:560, maxHeight:"90vh", overflowY:"auto", padding:28 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <h2 style={{ margin:0, fontSize:16, fontWeight:800, color:"#fff" }}>📥 Importar votantes</h2>
          <button onClick={onClose} style={{ background:"none", border:"none", color:"#64748b", fontSize:20, cursor:"pointer" }}>✕</button>
        </div>

        {/* Paso 1 – Plantilla */}
        <div style={{ background:"#060c1a", borderRadius:12, padding:16, marginBottom:16 }}>
          <div style={{ fontSize:12, fontWeight:700, color:"#e2e8f0", marginBottom:6 }}>
            Paso 1 — Descarga la plantilla oficial
          </div>
          <p style={{ fontSize:12, color:"#64748b", margin:"0 0 10px" }}>
            Usa siempre la plantilla para evitar errores de formato. Incluye filas de ejemplo y las instrucciones dentro del archivo.
          </p>
          <Btn ghost onClick={descargarPlantilla}>⬇ Descargar plantilla CSV</Btn>
        </div>

        {/* Paso 2 – Seleccionar archivo */}
        <div style={{ background:"#060c1a", borderRadius:12, padding:16, marginBottom:16 }}>
          <div style={{ fontSize:12, fontWeight:700, color:"#e2e8f0", marginBottom:10 }}>
            Paso 2 — Selecciona el archivo CSV completo
          </div>
          <input
            ref={fileRef}
            type="file"
            accept=".csv,text/csv"
            onChange={leerArchivo}
            style={{ display:"none" }}
          />
          <Btn ghost onClick={() => fileRef.current.click()}>📂 Seleccionar archivo .csv</Btn>
          {resultado && (
            <span style={{ marginLeft:12, fontSize:12, color:"#64748b" }}>
              Archivo leído ✓
            </span>
          )}
        </div>

        {/* Paso 3 – Vista previa */}
        {resultado && (
          <div style={{ background:"#060c1a", borderRadius:12, padding:16, marginBottom:16 }}>
            <div style={{ fontSize:12, fontWeight:700, color:"#e2e8f0", marginBottom:12 }}>
              Paso 3 — Vista previa
            </div>

            {/* Resumen */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:14 }}>
              {[
                { label:"Válidos para importar", value:resultado.validos.length,    color:"#10b981" },
                { label:"Con errores",           value:resultado.errores.length,    color:"#ef4444" },
                { label:"Duplicados (omitidos)", value:resultado.duplicados.length, color:"#f59e0b" },
              ].map(s => (
                <div key={s.label} style={{ background:"#0d1b3e", borderRadius:8, padding:"10px 12px", textAlign:"center" }}>
                  <div style={{ fontSize:20, fontWeight:900, color:s.color }}>{s.value}</div>
                  <div style={{ fontSize:9, color:"#4b6080", fontWeight:700 }}>{s.label.toUpperCase()}</div>
                </div>
              ))}
            </div>

            {/* Errores */}
            {resultado.errores.length > 0 && (
              <div style={{ marginBottom:10 }}>
                <div style={{ fontSize:11, fontWeight:700, color:"#ef4444", marginBottom:6 }}>⚠ Filas con errores (no se importarán):</div>
                <div style={{ maxHeight:100, overflowY:"auto" }}>
                  {resultado.errores.map((e, i) => (
                    <div key={i} style={{ fontSize:11, color:"#94a3b8", padding:"3px 0", borderBottom:"1px solid #1e3a6e20" }}>
                      Fila {e.fila} {e.nombre ? `— ${e.nombre}` : ""}: <span style={{ color:"#ef4444" }}>{e.msg}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Duplicados */}
            {resultado.duplicados.length > 0 && (
              <div style={{ marginBottom:10 }}>
                <div style={{ fontSize:11, fontWeight:700, color:"#f59e0b", marginBottom:6 }}>🔁 Duplicados omitidos (cédula ya existe):</div>
                <div style={{ maxHeight:80, overflowY:"auto" }}>
                  {resultado.duplicados.map((d, i) => (
                    <div key={i} style={{ fontSize:11, color:"#94a3b8", padding:"3px 0" }}>
                      Fila {d.fila} — {d.nombre} (CC {d.cedula})
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Previsualización de válidos */}
            {resultado.validos.length > 0 && (
              <div>
                <div style={{ fontSize:11, fontWeight:700, color:"#10b981", marginBottom:6 }}>
                  ✓ Primeros registros a importar:
                </div>
                <div style={{ maxHeight:120, overflowY:"auto" }}>
                  {resultado.validos.slice(0, 5).map((v, i) => (
                    <div key={i} style={{ fontSize:11, color:"#94a3b8", padding:"4px 0", borderBottom:"1px solid #1e3a6e20", display:"flex", gap:16 }}>
                      <span style={{ color:"#e2e8f0", fontWeight:600 }}>{v.nombre}</span>
                      <span>CC {v.cedula}</span>
                      <span>{v.phone}</span>
                      <span style={{ color:"#64748b" }}>{v.barrio}</span>
                    </div>
                  ))}
                  {resultado.validos.length > 5 && (
                    <div style={{ fontSize:11, color:"#4b6080", padding:"4px 0" }}>
                      … y {resultado.validos.length - 5} más.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
          <Btn ghost onClick={onClose}>Cancelar</Btn>
          <Btn
            disabled={!resultado?.validos?.length || importing}
            onClick={confirmarImport}
          >
            ✓ Importar {resultado?.validos?.length ?? 0} votantes
          </Btn>
        </div>
      </div>
    </div>
  );
}

// ─── Vista principal ───────────────────────────────────────────
export default function GestionVotantes() {
  const { votantes, lideres, candidatos, addVotante, updateVotante, deleteVotante, addVotantesBulk } = useApp();
  const [search,       setSearch]      = useState("");
  const [liderFilter,  setLiderFilter]  = useState("all");
  const [campFilter,   setCampFilter]   = useState("all");
  const [modal,        setModal]        = useState(null);
  const [detalle,      setDetalle]      = useState(null);
  const [confirm,      setConfirm]      = useState(null);
  const [showImport,   setShowImport]   = useState(false);

  const filtered = votantes.filter(v => {
    const matchSearch = !search
      || v.nombre.toLowerCase().includes(search.toLowerCase())
      || v.cedula.includes(search)
      || v.barrio?.toLowerCase().includes(search.toLowerCase());
    const matchLider = liderFilter === "all" || (v.liderIds ?? []).includes(liderFilter);
    const matchCamp  = campFilter  === "all" || (v.campañas ?? []).includes(campFilter);
    return matchSearch && matchLider && matchCamp;
  });

  const totalConf = votantes.filter(v => v.estado?.["GOB"] === "confirmado").length;
  const totalPend = votantes.filter(v => v.estado?.["GOB"] === "pendiente").length;
  const totalSC   = votantes.filter(v => !v.estado?.["GOB"] || v.estado?.["GOB"] === "no_contactado").length;

  return (
    <div style={{ paddingRight: detalle ? 360 : 0 }}>
      {/* ── KPIs ── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:24 }}>
        {[
          { label:"Total padrón",    value:votantes.length, color:"#e2e8f0" },
          { label:"Confirmados",     value:totalConf,       color:"#10b981" },
          { label:"Pendientes",      value:totalPend,       color:"#f59e0b" },
          { label:"Sin contactar",   value:totalSC,         color:"#6b7280" },
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
          placeholder="🔍  Buscar nombre, cédula o barrio…"
          style={{ ...inputSt, flex:1, minWidth:220 }}
        />
        <select value={liderFilter} onChange={e => setLiderFilter(e.target.value)} style={{ ...selectSt, width:170 }}>
          <option value="all">Todos los líderes</option>
          {lideres.map(l => <option key={l.id} value={l.id}>{l.nombre}</option>)}
        </select>
        <select value={campFilter} onChange={e => setCampFilter(e.target.value)} style={{ ...selectSt, width:170 }}>
          <option value="all">Todas las campañas</option>
          <option value="GOB">Gobernador</option>
          {candidatos.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
        </select>
        <Btn ghost onClick={() => setShowImport(true)}>📥 Importar</Btn>
        <Btn ghost onClick={() => descargarCSV(votantesToCSV(votantes), `votantes_${new Date().toISOString().slice(0,10)}.csv`)}>
          📤 Exportar ({votantes.length})
        </Btn>
        <Btn onClick={() => setModal({ mode:"add" })}>+ Registrar votante</Btn>
      </div>

      {/* ── Tabla ── */}
      <div style={{ background:"#0d1b3e", border:"1px solid #1e3a6e", borderRadius:14, overflow:"hidden" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ background:"#060c1a" }}>
              {["Votante","Cédula","Barrio","Puesto · Mesa","Líderes","Estado GOB","Acciones"].map(h => (
                <th key={h} style={{ padding:"11px 14px", textAlign:"left", fontSize:10, fontWeight:700, color:"#4b6080", letterSpacing:".06em", whiteSpace:"nowrap" }}>
                  {h.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} style={{ padding:40, textAlign:"center", color:"#4b6080", fontSize:13 }}>
                  No se encontraron votantes con los filtros aplicados.
                </td>
              </tr>
            )}
            {filtered.map((v, i) => {
              const est   = v.estado?.["GOB"] ?? "no_contactado";
              const em    = ESTADO_META[est];
              const lids  = lideres.filter(l => (v.liderIds ?? []).includes(l.id));
              const activo = detalle?.id === v.id;
              return (
                <tr key={v.id}
                  onClick={() => setDetalle(activo ? null : v)}
                  style={{
                    borderTop:"1px solid #1e3a6e14",
                    background: activo ? "#1e3a6e30" : i%2===0 ? "transparent" : "#060c1a20",
                    cursor:"pointer",
                    transition:"background .15s",
                  }}
                >
                  {/* Nombre */}
                  <td style={{ padding:"11px 14px" }}>
                    <div style={{ fontSize:13, fontWeight:700, color:"#e2e8f0" }}>{v.nombre}</div>
                    <div style={{ fontSize:10, color:"#4b6080" }}>{v.id}</div>
                  </td>
                  {/* Cédula */}
                  <td style={{ padding:"11px 14px", fontSize:12, color:"#94a3b8", fontFamily:"monospace" }}>{v.cedula}</td>
                  {/* Barrio */}
                  <td style={{ padding:"11px 14px", fontSize:12, color:"#94a3b8" }}>{v.barrio}</td>
                  {/* Puesto · Mesa */}
                  <td style={{ padding:"11px 14px" }}>
                    <div style={{ fontSize:12, color:"#94a3b8" }}>{v.puesto}</div>
                    <div style={{ fontSize:10, color:"#4b6080" }}>Mesa {v.mesa}</div>
                  </td>
                  {/* Líderes */}
                  <td style={{ padding:"11px 14px" }}>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:3 }}>
                      {lids.map(l => (
                        <span key={l.id} style={{ background:"#3b82f618", color:"#3b82f6", border:"1px solid #3b82f633", borderRadius:12, padding:"2px 7px", fontSize:10, fontWeight:600 }}>
                          {l.nombre.split(" ")[0]}
                        </span>
                      ))}
                      {lids.length === 0 && <span style={{ fontSize:11, color:"#4b6080" }}>—</span>}
                    </div>
                  </td>
                  {/* Estado GOB */}
                  <td style={{ padding:"11px 14px" }}>
                    <span style={{ background:em.bg, color:em.color, border:`1px solid ${em.color}44`, borderRadius:12, padding:"3px 10px", fontSize:11, fontWeight:700 }}>
                      {em.label}
                    </span>
                  </td>
                  {/* Acciones */}
                  <td style={{ padding:"11px 14px" }} onClick={e => e.stopPropagation()}>
                    <div style={{ display:"flex", gap:6 }}>
                      <ActionBtn color="#3b82f6" title="Editar"
                        onClick={() => setModal({ mode:"edit", votante: v })}>✏️</ActionBtn>
                      <ActionBtn color="#ef4444" title="Eliminar"
                        onClick={() => setConfirm({ id: v.id, nombre: v.nombre })}>🗑️</ActionBtn>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div style={{ padding:"10px 14px", borderTop:"1px solid #1e3a6e", fontSize:11, color:"#4b6080" }}>
          Mostrando {filtered.length} de {votantes.length} votantes en el padrón
        </div>
      </div>

      {/* Panel detalle */}
      {detalle && (
        <PanelDetalle
          votante={detalle}
          onClose={() => setDetalle(null)}
          onEdit={() => { setModal({ mode:"edit", votante: detalle }); setDetalle(null); }}
        />
      )}

      {/* Modales */}
      {modal?.mode === "add" && (
        <ModalVotante onSave={addVotante} onClose={() => setModal(null)} />
      )}
      {modal?.mode === "edit" && (
        <ModalVotante
          votante={modal.votante}
          onSave={updateVotante}
          onClose={() => setModal(null)}
        />
      )}
      {confirm && (
        <ModalConfirm
          nombre={confirm.nombre}
          onConfirm={() => deleteVotante(confirm.id)}
          onClose={() => setConfirm(null)}
        />
      )}
      {showImport && (
        <ModalImportar
          votantesActuales={votantes}
          onImportar={addVotantesBulk}
          onClose={() => setShowImport(false)}
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
function Input(props) { return <input {...props} style={inputSt} />; }

function Btn({ children, onClick, ghost, danger, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding:"9px 18px", borderRadius:9, fontSize:12, fontWeight:700, cursor:disabled?"not-allowed":"pointer",
      opacity:disabled?0.5:1,
      background:ghost?"transparent":danger?"#ef444420":"#2563eb",
      border:ghost?"1px solid #1e3a6e":danger?"1px solid #ef4444":"none",
      color:ghost?"#94a3b8":danger?"#ef4444":"#fff",
    }}>{children}</button>
  );
}
function ActionBtn({ children, color, onClick, title }) {
  return (
    <button onClick={onClick} title={title} style={{
      width:30, height:30, borderRadius:8, border:`1px solid ${color}33`,
      background:`${color}15`, color, fontSize:14, cursor:"pointer",
      display:"flex", alignItems:"center", justifyContent:"center",
    }}>{children}</button>
  );
}
const accionSt = { padding:"5px 12px", borderRadius:8, fontSize:11, fontWeight:700, cursor:"pointer" };
const inputSt  = { width:"100%", background:"#060c1a", border:"1px solid #1e3a6e", borderRadius:9, padding:"9px 12px", color:"#e2e8f0", fontSize:13, outline:"none", boxSizing:"border-box" };
const selectSt = { background:"#060c1a", border:"1px solid #1e3a6e", borderRadius:9, padding:"9px 12px", color:"#e2e8f0", fontSize:13, outline:"none", cursor:"pointer" };
