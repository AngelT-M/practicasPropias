import TarjetaTarea from "./TarjetaTarea";

export default function ColumnaKanban({ titulo, estado, color, tareas, onVerTarea, onSoltarTarea }) {
  return (
    <div
      className="columna"
      onDragOver={e => e.preventDefault()}                           // Necesario para aceptar el drop
      onDrop={e => onSoltarTarea(Number(e.dataTransfer.getData('text/plain')), estado)}
    >
      {/* Cabecera de la columna con color lateral */}
      <div className="columna-header" style={{ borderTop: `4px solid ${color}` }}>
        <h3>{titulo}</h3>
        <span className="columna-contador">{tareas.length}</span>
      </div>

      {/* Tarjetas */}
      {tareas.length === 0
        ? <p className="columna-vacia">Sin tareas</p>
        : tareas.map(t => (
          <TarjetaTarea key={t.tarea_id} tarea={t} onVerTarea={onVerTarea} />
        ))
      }
    </div>
  );
}
