import ColumnaKanban from "./ColumnaKanban";

// Orden de prioridad para ordenar tarjetas dentro de cada columna
const PESO = { URGENTE: 0, ALTA: 1, MEDIA: 2, BAJA: 3 };
const porPrioridad = (a, b) =>
  (PESO[a.prioridad] ?? 4) - (PESO[b.prioridad] ?? 4) || (a.orden ?? 0) - (b.orden ?? 0);

const COLUMNAS = [
  { titulo: 'Pendiente', estado: 'PENDIENTE', color: '#2563eb' },
  { titulo: 'En Proceso', estado: 'EN_PROCESO', color: '#f59e08' },
  { titulo: 'Completadas', estado: 'COMPLETA', color: '#16a34a' },
];

export default function Tablero({ tareas, onVerTarea, onSoltarTarea }) {
  return (
    <div className="tablero">
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
