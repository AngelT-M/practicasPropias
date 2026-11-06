import { useState } from 'react'

export default function ModalCatalogo({ tipo, elemento, onGuardar, onCerrar }) {
  const esCategoria = tipo === 'categorias'
  const [nombre, setNombre] = useState(elemento?.nom_categoria ?? elemento?.nom_usuario ?? '')
  const [fechaNacimiento, setFechaNacimiento] = useState(elemento?.fecha_nac ?? '')
  const [numero, setNumero] = useState(elemento?.numero ?? '')
  const [email, setEmail] = useState(elemento?.email ?? '')
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  async function manejarSubmit(evento) {
    evento.preventDefault()
    if (guardando) return
    setGuardando(true)
    setError('')

    const datos = esCategoria
      ? { ...elemento, nom_categoria: nombre.trim() }
      : {
        ...elemento,
        nom_usuario: nombre.trim(),
        fecha_nac: fechaNacimiento,
        numero: numero.trim(),
        email: email.trim(),
      }

    try {
      await onGuardar(tipo, datos)
      onCerrar()
    } catch (e) {
      setError(e.message)
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={(evento) => evento.target === evento.currentTarget && !guardando && onCerrar()}>
      <div className="modal-contenido" role="dialog" aria-modal="true" aria-labelledby="catalogo-titulo">
        <div className="contenido-titulo">
          <h2 id="catalogo-titulo">{elemento ? 'EDITAR' : 'AGREGAR'} {esCategoria ? 'CATEGORÍA' : 'USUARIO'}</h2>
        </div>
        <form onSubmit={manejarSubmit}>
          <label htmlFor="catalogo-nombre">{esCategoria ? 'Nombre de la categoría' : 'Nombre completo'}</label>
          <input id="catalogo-nombre" value={nombre} onChange={(evento) => setNombre(evento.target.value)} required maxLength={120} autoFocus />

          {!esCategoria && (
            <>
              <label htmlFor="usuario-fecha">Fecha de nacimiento</label>
              <input id="usuario-fecha" type="date" value={fechaNacimiento} onChange={(evento) => setFechaNacimiento(evento.target.value)} required />

              <label htmlFor="usuario-numero">Teléfono</label>
              <input id="usuario-numero" value={numero} onChange={(evento) => setNumero(evento.target.value)} required />

              <label htmlFor="usuario-email">Correo electrónico</label>
              <input id="usuario-email" type="email" value={email} onChange={(evento) => setEmail(evento.target.value)} required />
            </>
          )}

          {error && <p className="mensaje-api" role="alert">{error}</p>}
          <div className="modal-acciones">
            <button type="button" className="btn btn-cerrar" onClick={onCerrar} disabled={guardando}>Cancelar</button>
            <button type="submit" className="btn btn-primario" disabled={guardando}>
              {guardando ? 'Guardando...' : elemento ? 'Guardar cambios' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
