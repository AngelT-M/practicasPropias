
const COLORES_PRIORIDAD = {
  URGENTE: "#7c3aed",
  ALTA: "#ef4444",
  MEDIA: "#f59e08",
  BAJA: "#16a34a",
};
function obtenerInicales(nombreCompleto) {
  return (nombreCompleto || 'SA')
    .trim()
    .split(/\s+/)
    .map(palabra => palabra[0])
    .join('')
    .toUpperCase();
}

export default function TarjetaTarea({ tarea, onVerTarea }) {
  function manejarDragStart(evento) {
    evento.dataTransfer.setData('text/plain', tarea.tarea_id);
  }

  return (
    <div className="tarjeta-tarea"
      draggable
      onDragStart={manejarDragStart}
      onClick={() => onVerTarea(tarea)}
    >

      <div className="tarjeta-header">
        <h4>{tarea.titulo}</h4>
        {tarea.nom_categoria && (
          <span className="badge-categoria">{tarea.nom_categoria}</span>
        )}
      </div>
      <p className="tarjeta_descripcion">{tarea.descripcion}</p>
      <div className="tarjeta-footer">
        <span
          className="badge-prioridad"
          style={{ backgroundColor: COLORES_PRIORIDAD[tarea.prioridad] }}
        >
          {' '}{tarea.prioridad}
        </span>

        <span className="avatar-pequeno">{obtenerInicales(tarea.nom_usuario || 'SA')}</span>

      </div>
    </div>
  );
}
