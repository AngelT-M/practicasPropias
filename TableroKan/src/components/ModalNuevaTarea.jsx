import { useState } from "react";

export default function ModalNuevaTarea({
  estadoInicial,
  categorias,
  usuarios,
  onCrear,
  onCerrar,
}) {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoriaId, setCategoriaId] = useState(
    String(categorias[0]?.categoria_id ?? '')
  );
  const [usuarioId, setUsuarioId] = useState(
    String(usuarios[0]?.usuario_id ?? '')
  );
  const [prioridad, setPrioridad] = useState('MEDIA');
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);

  async function manejarSubmit(evento) {
    evento.preventDefault();
    if (!titulo.trim() || !categoriaId || !usuarioId || guardando) return;

    setGuardando(true);
    setError(null);
    try {
      await onCrear({
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        categoria_id: categoriaId,
        usuario_id: usuarioId,
        prioridad,
        estado: estadoInicial,
      });
      onCerrar();
    } catch (e) {
      setError(e.message);
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onCerrar}>
      <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
        <div className="contenido-titulo">
          <h1 className="titulo">AGREGAR TAREA</h1>
        </div>
        <form onSubmit={manejarSubmit}>
          <label htmlFor="tarea-titulo">Título</label>
          <input
            id="tarea-titulo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            autoFocus
            required
          />

          <label htmlFor="tarea-descripcion">Descripción</label>
          <textarea
            id="tarea-descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />

          <label htmlFor="tarea-categoria">Categoría</label>
          <select
            id="tarea-categoria"
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
            required
          >
            {categorias.map((categoria) => (
              <option
                key={categoria.categoria_id}
                value={categoria.categoria_id}
              >
                {categoria.nom_categoria}
              </option>
            ))}
          </select>

          <label htmlFor="tarea-usuario">Asignar a usuario</label>
          <select
            id="tarea-usuario"
            value={usuarioId}
            onChange={(e) => setUsuarioId(e.target.value)}
            required
          >
            {usuarios.map((usuario) => (
              <option key={usuario.usuario_id} value={usuario.usuario_id}>
                {usuario.nom_usuario}
              </option>
            ))}
          </select>

          <label htmlFor="tarea-prioridad">Prioridad</label>
          <select
            id="tarea-prioridad"
            value={prioridad}
            onChange={(e) => setPrioridad(e.target.value)}
          >
            <option value="ALTA">Alta</option>
            <option value="MEDIA">Media</option>
            <option value="BAJA">Baja</option>
          </select>

          {error && <p className="mensaje-api" role="alert">{error}</p>}
          {!categorias.length && (
            <p className="mensaje-api" role="alert">
              No hay categorías disponibles en la API.
            </p>
          )}
          {!usuarios.length && (
            <p className="mensaje-api" role="alert">
              No hay usuarios disponibles en la API.
            </p>
          )}

          <div className="modal-acciones">
            <button
              type="button"
              onClick={onCerrar}
              className="btn btn-cerrar"
              disabled={guardando}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primario"
              disabled={guardando || !categorias.length || !usuarios.length}
            >
              {guardando ? 'Guardando...' : 'Crear tarea'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
