import { useState } from "react";
export default function ModalTarjetaTarea({ tarea, categorias = [], usuarios = [], onCerrar, onActualizar, onEliminar }) {
    const [editando, setEditando] = useState(false);
    const [titulo, setTitulo] = useState(tarea.titulo);
    const [descripcion, setDescripcion] = useState(tarea.descripcion);
    const [categoriaId, setCategoriaId] = useState(
        String(tarea.categoria_id ?? categorias[0]?.categoria_id ?? '')
    );

    const usuarioActual = usuarios.find((u) => u.nom_usuario === tarea.nom_usuario);
    const [usuarioId, setUsuarioId] = useState(
        String(tarea.usuario_id ?? usuarioActual?.usuario_id ?? usuarios[0]?.usuario_id ?? '1')
    );


    const [prioridad, setPrioridad] = useState(tarea.prioridad);
    const [estado, setEstado] = useState(tarea.estado);
    const [guardando, setGuardando] = useState(false);
    const [eliminando, setEliminando] = useState(false);
    const [errorEliminar, setErrorEliminar] = useState(null);
    const [errorGuardar, setErrorGuardar] = useState(null);

    async function manejarGuardar(e) {
        e.preventDefault();
        if (!titulo.trim() || guardando) return;
        setGuardando(true);
        setErrorGuardar(null);
        try {
            await onActualizar(tarea.tarea_id, {
                titulo: titulo.trim(),
                descripcion: descripcion.trim(),
                categoria_id: Number(categoriaId),
                usuario_id: Number(usuarioId),
                prioridad: prioridad,
                estado,
            });
        } catch (error) {
            setErrorGuardar(error.message);
        } finally {
            setGuardando(false);
        }
    }

    async function manejarEliminar() {
        if (!window.confirm(`¿Eliminar la tarea "${tarea.titulo}"?`)) return;

        setEliminando(true);
        setErrorEliminar(null);
        try {
            await onEliminar(tarea.tarea_id);
        } catch (e) {
            setErrorEliminar(e.message);
        } finally {
            setEliminando(false);
        }
    }

    return (
        <div className="modal-overlay" onClick={onCerrar}>
            <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
                <button onClick={onCerrar} className="btn-cerrar">✖</button>
                <div className="contenido-titulo">
                    <h1>{editando ? "EDITAR TAREA" : "DATOS TAREA"}</h1>
                </div>
                {editando ? (
                    /* MODO EDICIÓN */
                    <form onSubmit={manejarGuardar}>
                        <label htmlFor="edit-titulo">Título</label>
                        <input
                            id="edit-titulo"
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                            required
                        />
                        <label htmlFor="edit-descripcion">Descripción</label>
                        <textarea
                            id="edit-descripcion"
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                        />
                        <label htmlFor="edit-categoria">Categoría</label>
                        <select
                            id="edit-categoria"
                            value={categoriaId}
                            onChange={(e) => setCategoriaId(e.target.value)}
                        >
                            {categorias.map((cat) => (
                                <option key={cat.categoria_id} value={cat.categoria_id}>
                                    {cat.nom_categoria}
                                </option>
                            ))}
                        </select>
                        <label htmlFor="edit-usuario">Asignar a Usuario</label>
                        <select
                            id="edit-usuario"
                            value={usuarioId}
                            onChange={(e) => setUsuarioId(e.target.value)}
                        >
                            {usuarios.map((u) => (
                                <option key={u.usuario_id} value={u.usuario_id}>
                                    {u.nom_usuario}
                                </option>
                            ))}
                        </select>

                        <label htmlFor="edit-prioridad">Prioridad</label>
                        <select
                            id="edit-prioridad"
                            value={prioridad}
                            onChange={(e) => setPrioridad(e.target.value)}
                        >
                            <option value="ALTA">Alta</option>
                            <option value="MEDIA">Media</option>
                            <option value="BAJA">Baja</option>
                        </select>

                        <label htmlFor="edit-estado">Estado</label>
                        <select
                            id="edit-estado"
                            value={estado}
                            onChange={(e) => setEstado(e.target.value)}
                        >
                            <option value="PENDIENTE">Pendiente</option>
                            <option value="EN_PROCESO">En Proceso</option>
                            <option value="COMPLETA">Completada</option>
                        </select>

                        {errorGuardar && <p className="mensaje-api" role="alert">{errorGuardar}</p>}
                        <div className="modal-acciones" style={{ marginTop: '16px' }}>
                            <button
                                type="button"
                                className="btn btn-cerrar"
                                onClick={() => setEditando(false)}
                                disabled={guardando}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primario"
                                disabled={guardando}
                            >
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
                        <p className="tarjeta_descripcion">Descripción: {tarea.descripcion}</p>
                        <p><strong>Categoría:</strong> {tarea.nom_categoria || 'Sin categoría'}</p>
                        <p><strong>Prioridad:</strong> {tarea.prioridad}</p>
                        <p><strong>Estado:</strong> {tarea.estado}</p>
                        <p><strong>Usuario:</strong> {tarea.nom_usuario || 'Sin asignar'}</p>
                        <p><strong>Fecha de Creación:</strong> {tarea.fecha_creacion || 'No disponible'}</p>
                        {errorEliminar && <p className="mensaje-api" role="alert">{errorEliminar}</p>}
                        <div className="modal-acciones" style={{ marginTop: '16px' }}>
                            <button
                                type="button"
                                className="btn btn-cerrar"
                                onClick={manejarEliminar}
                                disabled={eliminando}
                            >
                                {eliminando ? "Eliminando..." : "Eliminar tarea"}
                            </button>
                            <button
                                type="button"
                                className="btn btn-primario"
                                onClick={() => setEditando(true)}
                                disabled={eliminando}
                            >
                                ✏️ Editar Tarea
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
