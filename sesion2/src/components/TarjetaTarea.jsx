
function obtenerInicales(nombreCompleto) {
  return nombreCompleto
    .split(' ')
    .map(palabra => palabra[0])
    .join('')
    .toUpperCase();
}

export default function TarjetaTarea({ tarea, onVerTarea }) {
  function manejarDragStart(evento) {
    // Guarda el ID para que la columna destino sepa cuál tarea fue arrastrada.
    evento.dataTransfer.setData('text/plain', tarea.id_tarea);
  }

  // draggable activa el arrastre; el clic solicita abrir el modal de esta tarea.
  return (
    <div className="tarjeta-tarea"
      draggable
      onDragStart={manejarDragStart}
      onClick={() => onVerTarea(tarea)}
    >

      <div className="tarjeta-header">
        <h4>{tarea.titulo}</h4>
        {(tarea.nom_categoria || tarea.categoria) && (
          <span className="badge-categoria">{tarea.nom_categoria ?? tarea.categoria}</span>
        )}
      </div>
      <p className="tarjeta_descripcion">{tarea.descripcion}</p>
      <div className="tarjeta-footer">
        <span className="badge-prioridad">
          {' '}{tarea.prioridad}
        </span>

        {tarea.fecha_limite && <span>📅 {tarea.fecha_limite}</span>}

      </div>
    </div>
  );
}
