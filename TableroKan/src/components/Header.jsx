export default function Header({
  vista,
  onCambiarVista,
  onNuevaTarea,
  onNuevoElemento,
  buscar,
  onCambiarBuscar,
  filPrioridad,
  onCambiarPrioridad,
  filCategoria,
  onCambiarCategoria,
  filUsuario,
  onCambiarUsuario,
  categorias = [],
  usuarios = [],
  totalTareas,
  totalFiltradas,
  onLimpiarFiltros,
  onCerrarSesion,
}) {
  const prioridades = ['TODAS', 'URGENTE', 'ALTA', 'MEDIA', 'BAJA']
  const hayFiltros = buscar || filPrioridad !== 'TODAS' || filCategoria !== 'TODAS' || filUsuario !== 'TODAS'

  return (
    <header className="app-header">
      <div className="header-fila">
        <span className="logo">📋 Gestión de Trabajo</span>

        <nav className="navegacion" aria-label="Secciones">
          {[
            ['tablero', 'Tablero'],
            ['categorias', 'Categorías'],
            ['usuarios', 'Usuarios'],
          ].map(([id, etiqueta]) => (
            <button
              key={id}
              type="button"
              className={`nav-pestana ${vista === id ? 'nav-pestana-activa' : ''}`}
              onClick={() => onCambiarVista(id)}
              aria-current={vista === id ? 'page' : undefined}
            >
              {etiqueta}
            </button>
          ))}
        </nav>

        <button
          type="button"
          className="btn btn-oscuro"
          onClick={vista === 'tablero' ? onNuevaTarea : onNuevoElemento}
        >
          + {vista === 'tablero' ? 'Nueva tarea' : vista === 'categorias' ? 'Nueva categoría' : 'Nuevo usuario'}
        </button>

        <button type="button" className="btn btn-cerrar-sesion" onClick={onCerrarSesion}>
          Cerrar sesión
        </button>
      </div>

      {vista === 'tablero' && (
        <div className="filtro-barra">
          <div className="buscador-caja">
            🔍
            <input
              className="buscador"
              type="search"
              placeholder="Buscar tarea..."
              value={buscar}
              onChange={(evento) => onCambiarBuscar(evento.target.value)}
              aria-label="Buscar tarea"
            />
            {buscar && <button type="button" className="btn-x" onClick={() => onCambiarBuscar('')} aria-label="Limpiar búsqueda">✕</button>}
          </div>

          <div className="filtro-grupo">
            <span className="filtro-label">⚡ Prioridad:</span>
            {prioridades.map((prioridad) => (
              <button
                key={prioridad}
                type="button"
                className={`pill ${filPrioridad === prioridad ? 'pill-activo' : ''}`}
                onClick={() => onCambiarPrioridad(prioridad)}
              >
                {prioridad === 'TODAS' ? 'Todas' : prioridad[0] + prioridad.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          <label className="filtro-grupo">
            <span className="filtro-label">📁 Categoría:</span>
            <select className="filtro-select" value={filCategoria} onChange={(evento) => onCambiarCategoria(evento.target.value)}>
              <option value="TODAS">Todas</option>
              {categorias.map((categoria) => <option key={categoria.categoria_id} value={categoria.categoria_id}>{categoria.nom_categoria}</option>)}
            </select>
          </label>

          <label className="filtro-grupo">
            <span className="filtro-label">👤 Usuario:</span>
            <select className="filtro-select" value={filUsuario} onChange={(evento) => onCambiarUsuario(evento.target.value)}>
              <option value="TODAS">Todos</option>
              {usuarios.map((usuario) => <option key={usuario.usuario_id} value={usuario.usuario_id}>{usuario.nom_usuario}</option>)}
            </select>
          </label>

          <div className="contador-contenedor">
            <span className="contador">{totalFiltradas} / {totalTareas} tareas</span>
            {hayFiltros && <button type="button" className="btn-limpiar" onClick={onLimpiarFiltros}>Limpiar filtros</button>}
          </div>
        </div>
      )}
    </header>
  )
}
