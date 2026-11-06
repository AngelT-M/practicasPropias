import { useState } from "react";

// Campos editables por la nueva API: titulo, descripcion, id_categoria, prioridad, estado, fecha_limite
export default function ModalTarjetaTarea({ tarea, categorias = [], onCerrar, onActualizar, onEliminar }) {
    // Copias locales para editar; la tarea original no cambia hasta guardar.
    const [editando,  setEditando]  = useState(false);
    const [titulo,    setTitulo]    = useState(tarea.titulo ?? '');
    const [descripcion, setDescripcion] = useState(tarea.descripcion ?? '');
    const [categoriaId, setCategoriaId] = useState(String(tarea.id_categoria ?? categorias[0]?.id_categoria ?? ''));
    const [prioridad, setPrioridad] = useState(tarea.prioridad ?? 'MEDIA');
    const [estado,    setEstado]    = useState(tarea.estado ?? 'PENDIENTE');
    const [fechaLimite, setFechaLimite] = useState(tarea.fecha_limite ?? '');
    const [guardando,  setGuardando]  = useState(false);
    const [eliminando, setEliminando] = useState(false);
    const [errorEliminar, setErrorEliminar] = useState(null);

    // Si la respuesta no incluye el nombre, lo busca por ID en las categorías cargadas.
    const nomCategoria = tarea.nom_categoria || tarea.categoria || categorias.find(
        (categoria) => String(categoria.id_categoria) === String(tarea.id_categoria)
    )?.nombre;



    async function manejarGuardar(e) {
        // Evita recargar la página y guarda solo si hay un título válido.
        e.preventDefault();
        if (!titulo.trim() || guardando) return;
        setGuardando(true);
        try {
            await onActualizar(tarea.id_tarea, {
                titulo:       titulo.trim(),
                descripcion:  descripcion.trim(),
                id_categoria: Number(categoriaId),
                prioridad,
                estado,
                fecha_limite: fechaLimite || undefined,
            });
        } finally {
            setGuardando(false);
        }
    }

    async function manejarEliminar() {
        // Confirma la acción para evitar borrar por un clic accidental.
        if (!window.confirm(`¿Eliminar la tarea "${tarea.titulo}"?`)) return;
        setEliminando(true);
        setErrorEliminar(null);
        try {
            await onEliminar(tarea.id_tarea);
        } catch (e) {
            setErrorEliminar(e.message);
        } finally {
            setEliminando(false);
        }
    }

    return (
        <div className="modal-overlay" onClick={onCerrar}>
            {/* El fondo cierra el modal; los clics dentro del panel no llegan al fondo. */}
            <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
                <button onClick={onCerrar} className="btn-cerrar">✖</button>
                <div className="contenido-titulo">
                    <h1>{editando ? "EDITAR TAREA" : "DATOS TAREA"}</h1>
                </div>
                {editando ? (
                    /* MODO EDICIÓN */
                    <form onSubmit={manejarGuardar}>
                        <label htmlFor="edit-titulo">Título</label>
                        <input id="edit-titulo" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />

                        <label htmlFor="edit-descripcion">Descripción</label>
                        <textarea id="edit-descripcion" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />

                        <label htmlFor="edit-categoria">Categoría</label>
                        <select id="edit-categoria" value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)}>
                            {categorias.map((c) => (
                                <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>
                            ))}
                        </select>

                        <label htmlFor="edit-prioridad">Prioridad</label>
                        <select id="edit-prioridad" value={prioridad} onChange={(e) => setPrioridad(e.target.value)}>
                            <option value="ALTA">Alta</option>
                            <option value="MEDIA">Media</option>
                            <option value="BAJA">Baja</option>
                        </select>

                        <label htmlFor="edit-estado">Estado</label>
                        <select id="edit-estado" value={estado} onChange={(e) => setEstado(e.target.value)}>
                            <option value="PENDIENTE">Pendiente</option>
                            <option value="EN_PROCESO">En Proceso</option>
                            <option value="COMPLETA">Completa</option>
                        </select>

                        <label htmlFor="edit-fecha">Fecha límite</label>
                        <input id="edit-fecha" type="date" value={fechaLimite} onChange={(e) => setFechaLimite(e.target.value)} />

                        <div className="modal-acciones" style={{ marginTop: '16px' }}>
                            <button type="button" className="btn btn-cerrar" onClick={() => setEditando(false)} disabled={guardando}>
                                Cancelar
                            </button>
                            <button type="submit" className="btn btn-primario" disabled={guardando}>
                                {guardando ? "Guardando..." : "Guardar Cambios"}
                            </button>
                        </div>
                    </form>
                ) : (
                    /* MODO LECTURA */
                    <>
                        <div className="tarjeta-header">
                            <h4>{tarea.titulo}</h4>
                        </div>
                        <p className="tarjeta_descripcion">Descripción: {tarea.descripcion || '—'}</p>
                        <p><strong>Categoría:</strong> {nomCategoria || 'Sin categoría'}</p>
                        <p><strong>Prioridad:</strong> {tarea.prioridad}</p>
                        <p><strong>Estado:</strong> {tarea.estado}</p>
                        {tarea.fecha_limite && <p><strong>Fecha límite:</strong> {tarea.fecha_limite}</p>}
                        {errorEliminar && <p className="mensaje-api" role="alert">{errorEliminar}</p>}
                        <div className="modal-acciones" style={{ marginTop: '16px' }}>
                            <button type="button" className="btn btn-cerrar" onClick={manejarEliminar} disabled={eliminando}>
                                {eliminando ? "Eliminando..." : "Eliminar tarea"}
                            </button>
                            <button type="button" className="btn btn-primario" onClick={() => setEditando(true)} disabled={eliminando}>
                                ✏️ Editar Tarea
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
