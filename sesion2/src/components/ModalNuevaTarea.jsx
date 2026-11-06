import { useState } from "react";

// Los campos permitidos por la nueva API para crear una tarea:
//   titulo, descripcion, id_categoria, prioridad, estado, fecha_limite
export default function ModalNuevaTarea({
  estadoInicial = 'PENDIENTE',
  categorias,
  onCrear,
  onCerrar,
}) {
  // El estado del formulario se mantiene aquí hasta que el usuario lo envía.
  const [titulo,       setTitulo]       = useState('');
  const [descripcion,  setDescripcion]  = useState('');
  const [categoriaId,  setCategoriaId]  = useState(String(categorias[0]?.id_categoria ?? ''));
  const [prioridad,    setPrioridad]    = useState('MEDIA');
  const [fechaLimite,  setFechaLimite]  = useState('');
  const [guardando,    setGuardando]    = useState(false);
  const [error,        setError]        = useState(null);

  async function manejarSubmit(evento) {
    // Evita recargar la página y no permite enviar datos incompletos o duplicar el envío.
    evento.preventDefault();
    if (!titulo.trim() || !categoriaId || guardando) return;

    setGuardando(true);
    setError(null);
    try {
      await onCrear({
        titulo:       titulo.trim(),
        descripcion:  descripcion.trim(),
        id_categoria: categoriaId,
        prioridad,
        estado:       estadoInicial,
        fecha_limite: fechaLimite || undefined,
      });
      // Cierra el modal solo si el guardado terminó correctamente.
      onCerrar();
    } catch (e) {
      setError(e.message);
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onCerrar}>
      {/* Clic en el fondo cierra el modal; el panel detiene ese clic. */}
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
            {categorias.map((c) => (
              <option key={c.id_categoria} value={c.id_categoria}>
                {c.nombre}
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

          <label htmlFor="tarea-fecha">Fecha límite (opcional)</label>
          <input
            id="tarea-fecha"
            type="date"
            value={fechaLimite}
            onChange={(e) => setFechaLimite(e.target.value)}
          />

          {error && <p className="mensaje-api" role="alert">{error}</p>}
          {!categorias.length && (
            <p className="mensaje-api" role="alert">No hay categorías disponibles.</p>
          )}

          <div className="modal-acciones">
            <button type="button" onClick={onCerrar} className="btn btn-cerrar" disabled={guardando}>
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primario"
              disabled={guardando || !categorias.length}
            >
              {guardando ? 'Guardando...' : 'Crear tarea'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
