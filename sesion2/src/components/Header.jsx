export default function Header({
  proyecto,
  onVolver,
  onNuevaTarea,
  buscar, onCambiarBuscar,
  filPrioridad, onCambiarPrioridad,
  filCategoria, onCambiarCategoria,
  categorias = [],
  totalTareas, totalFiltradas,
  onLimpiarFiltros,
  usuario,
  onLogout,
}) {
  // Las opciones visibles; el filtro seleccionado vive en App y llega por props.
  const prioridades = ['TODAS', 'ALTA', 'MEDIA', 'BAJA'];

  // Solo se muestra "Limpiar" cuando al menos un filtro está activo.
  const hayFiltros =
    buscar ||
    filPrioridad !== 'TODAS' ||
    filCategoria !== 'TODAS';

  return (
    <header className="app-header">

      {/* Fila superior */}
      <div className="header-fila">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button className="btn-volver" onClick={onVolver} title="Volver a proyectos">← Proyectos</button>
          <span className="logo">📋 {proyecto?.nombre ?? 'Tablero'}</span>
        </div>

        <div className="buscador-caja">
          🔍
          {/* Cada cambio del campo actualiza el filtro guardado en App. */}
          <input
            className="buscador"
            type="text"
            placeholder="Buscar tarea..."
            value={buscar}
            onChange={e => onCambiarBuscar(e.target.value)}
          />
          {buscar && (
            <button className="btn-x" onClick={() => onCambiarBuscar('')}>✕</button>
          )}
        </div>

        <button className="btn btn-oscuro" onClick={onNuevaTarea}>+ Nueva tarea</button>

        <div className="usuario">
          <span className="avatar">
            {(usuario?.nombre ?? usuario?.usuario ?? 'U')[0].toUpperCase()}
          </span>
          <span>{usuario?.nombre ?? usuario?.usuario ?? ''}</span>
          <button className="btn btn-cerrar" onClick={onLogout}>Salir</button>
        </div>
      </div>

      {/* Barra de filtros */}
      <div className="filtro-barra">

        {/* Pills de prioridad */}
        <div className="filtro-grupo">
          <span className="filtro-label">⚡ Prioridad:</span>
          {prioridades.map(p => (
            <button
              key={p}
              className={`pill ${filPrioridad === p ? 'pill-activo' : ''}`}
              onClick={() => onCambiarPrioridad(p)}
            >
              {p === 'TODAS' ? 'Todas' : p[0] + p.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Select de categoría */}
        <div className="filtro-grupo">
          <span className="filtro-label">📁 Categoría:</span>
          <select className="filtro-select" value={filCategoria} onChange={e => onCambiarCategoria(e.target.value)}>
            <option value="TODAS">Todas</option>
            {categorias.map(c => (
              <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>
            ))}
          </select>
        </div>

        {/* Contador y botón limpiar */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="contador">{totalFiltradas} / {totalTareas} tareas</span>
          {/* Este callback restablece en App la búsqueda y los filtros. */}
          {hayFiltros && (
            <button className="btn-limpiar" onClick={onLimpiarFiltros}>🔄 Limpiar</button>
          )}
        </div>

      </div>
    </header>
  );
}
