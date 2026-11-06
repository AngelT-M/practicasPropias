import ColumnaKanban from "./ColumnaKanban";

// Orden de prioridad para ordenar tarjetas dentro de cada columna
const PESO = { ALTA: 1, MEDIA: 2, BAJA: 3 };
// Compara por prioridad; si empatan, usa el orden recibido de la API.
const porPrioridad = (a, b) =>
  (PESO[a.prioridad] ?? 4) - (PESO[b.prioridad] ?? 4) || (a.orden ?? 0) - (b.orden ?? 0);

const COLUMNAS = [
  { titulo: 'Pendiente', estado: 'PENDIENTE', color: '#E0E7FF' },
  { titulo: 'En Proceso', estado: 'EN_PROCESO', color: '#FEF3C7' },
  { titulo: 'Completadas', estado: 'COMPLETA', color: '#DCFCE7' },
];

export default function Tablero({ tareas, onVerTarea, onSoltarTarea }) {
  return (
    <div className="tablero">
      {/* Crea una columna por estado y le pasa solo las tareas que corresponden. */}
      {COLUMNAS.map(col => (
        <ColumnaKanban
          key={col.estado}
          titulo={col.titulo}
          estado={col.estado}
          color={col.color}
          tareas={tareas.filter(t => t.estado === col.estado).sort(porPrioridad)}
          onVerTarea={onVerTarea}
          onSoltarTarea={onSoltarTarea}
        />
      ))}
    </div>
  );
}
