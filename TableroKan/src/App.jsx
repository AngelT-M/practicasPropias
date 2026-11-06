import { useEffect, useState } from 'react'
import Header from './components/Header'
import Tablero from './components/Tablero'
import ModalNuevaTarea from './components/ModalNuevaTarea'
import ModalTarjetaTarea from './components/ModalTarjetaTarea'
import ModalCatalogo from './components/ModalCatalogo'
import Login from './components/Login'
import { categoriaApi, cerrarSesion, obtenerToken, tareaApi, usuarioApi } from './services/api'
import './App.css'

async function obtenerDatos() {
  const [tareasAPI, categoriasAPI, usuariosAPI] = await Promise.all([
    tareaApi.mostrar(),
    categoriaApi.mostrar(),
    usuarioApi.mostrar(),
  ])
  if (!Array.isArray(tareasAPI) || !Array.isArray(categoriasAPI) || !Array.isArray(usuariosAPI)) {
    throw new Error('La API devolvió una respuesta con formato inesperado.')
  }
  return { tareasAPI, categoriasAPI, usuariosAPI }
}

function App() {
  const [token, setToken] = useState(obtenerToken)
  const [tareas, setTareas] = useState([])
  const [categorias, setCategorias] = useState([])
  const [usuarios, setUsuarios] = useState([])

  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  const [buscar, setBuscar] = useState('')
  const [filPrioridad, setFilPrioridad] = useState('TODAS')
  const [filCategoria, setFilCategoria] = useState('TODAS')
  const [filUsuario, setFilUsuario] = useState('TODAS')
  
  const [vista, setVista] = useState('tablero')
  const [modalNueva, setModalNueva] = useState(false)
  const [tareaSeleccionada, setTareaSeleccionada] = useState(null)
  const [catalogoSeleccionado, setCatalogoSeleccionado] = useState(null)

  async function cargarDatos(mostrarCarga = true) {
    if (mostrarCarga) setCargando(true)
    setError(null)

    try {
      const { tareasAPI, categoriasAPI, usuariosAPI } = await obtenerDatos()
      setTareas(tareasAPI)
      setCategorias(categoriasAPI)
      setUsuarios(usuariosAPI)
      return true
    } catch (e) {
      setError(e.message)
      return false
    } finally {
      if (mostrarCarga) setCargando(false)
    }
  }

  useEffect(() => {
    function manejarSesionExpirada() {
      setToken(null)
      setError(null)
      setTareas([])
      setCategorias([])
      setUsuarios([])
    }

    window.addEventListener('api:unauthorized', manejarSesionExpirada)
    return () => window.removeEventListener('api:unauthorized', manejarSesionExpirada)
  }, [])

  useEffect(() => {
    if (!token) return undefined

    let vigente = true
    obtenerDatos()
      .then(({ tareasAPI, categoriasAPI, usuariosAPI }) => {
        if (!vigente) return
        setTareas(tareasAPI)
        setCategorias(categoriasAPI)
        setUsuarios(usuariosAPI)
      })
      .catch((e) => {
        if (vigente) setError(e.message)
      })
      .finally(() => {
        if (vigente) setCargando(false)
      })
    return () => {
      vigente = false
    }
  }, [token])

  const tareasFiltro = tareas.filter((tarea) => {
    const consulta = buscar.trim().toLocaleLowerCase()
    const coincideTexto = !consulta || [
      tarea.titulo,
      tarea.descripcion,
      tarea.nom_categoria,
      tarea.nom_usuario,
    ].some((valor) => valor?.toLocaleLowerCase().includes(consulta))
    const coincidePrioridad = filPrioridad === 'TODAS' || tarea.prioridad === filPrioridad
    const coincideCategoria = filCategoria === 'TODAS' || String(tarea.categoria_id) === filCategoria
    const coincideUsuario = filUsuario === 'TODAS' || String(tarea.usuario_id) === filUsuario
    return coincideTexto && coincidePrioridad && coincideCategoria && coincideUsuario
  })

  function limpiarFiltros() {
    setBuscar('')
    setFilPrioridad('TODAS')
    setFilCategoria('TODAS')
    setFilUsuario('TODAS')
  }

  async function guardarYRecargar(accion) {
    setError(null)
    try {
      await accion()
      const actualizados = await cargarDatos()
      if (!actualizados) {
        throw new Error('La operación se guardó, pero no se pudieron actualizar los datos.')
      }
      return true
    } catch (e) {
      setError(e.message)
      throw e
    }
  }

  async function moverTarea(idTarea, nuevoEstado) {
    const tarea = tareas.find((elemento) => Number(elemento.tarea_id) === idTarea)
    if (!tarea || tarea.estado === nuevoEstado) return

    const maxOrden = tareas
      .filter((elemento) => elemento.estado === nuevoEstado)
      .reduce((maximo, elemento) => Math.max(maximo, elemento.orden ?? 0), 0)

    try {
      await tareaApi.actualizar(idTarea, { estado: nuevoEstado, orden: maxOrden + 1 })
      const nuevasTareas = await tareaApi.mostrar()
      if (!Array.isArray(nuevasTareas)) throw new Error('La API devolvió tareas con formato inesperado.')
      setTareas(nuevasTareas)
      setError(null)
    } catch (e) {
      setError(e.message)
    }
  }

  function agregarTarea(nueva) {
    const maxOrden = tareas
      .filter((tarea) => tarea.estado === 'PENDIENTE')
      .reduce((maximo, tarea) => Math.max(maximo, tarea.orden ?? 0), 0)

    return guardarYRecargar(() => tareaApi.crear({
      titulo: nueva.titulo,
      descripcion: nueva.descripcion,
      categoria_id: Number(nueva.categoria_id),
      usuario_id: Number(nueva.usuario_id),
      prioridad: nueva.prioridad,
      estado: 'PENDIENTE',
      orden: maxOrden + 1,
      fecha_creacion: new Date().toISOString().slice(0, 19).replace('T', ' '),
    }))
  }

  function editarTarea(idTarea, datos) {
    return guardarYRecargar(() => tareaApi.actualizar(idTarea, datos))
      .then(() => setTareaSeleccionada(null))
  }

  async function eliminarTarea(idTarea) {
    await guardarYRecargar(() => tareaApi.eliminar(idTarea))
    setTareaSeleccionada(null)
  }

  async function guardarElementoCatalogo(tipo, elemento) {
    const esCategoria = tipo === 'categorias'
    const id = esCategoria ? elemento.categoria_id : elemento.usuario_id
    const api = esCategoria ? categoriaApi : usuarioApi
    const datos = esCategoria
      ? { nom_categoria: elemento.nom_categoria.trim() }
      : {
        nom_usuario: elemento.nom_usuario.trim(),
        fecha_nac: elemento.fecha_nac,
        numero: elemento.numero.trim(),
        email: elemento.email.trim(),
      }

    if (id) {
      await guardarYRecargar(() => api.actualizar(id, datos))
    } else {
      await guardarYRecargar(() => api.crear(datos))
    }
    setCatalogoSeleccionado(null)
  }

  async function eliminarElementoCatalogo(tipo, elemento) {
    const esCategoria = tipo === 'categorias'
    const nombre = esCategoria ? elemento.nom_categoria : elemento.nom_usuario
    if (!window.confirm(`¿Eliminar "${nombre}"? La API puede rechazarlo si todavía tiene tareas relacionadas.`)) return

    const id = esCategoria ? elemento.categoria_id : elemento.usuario_id
    const api = esCategoria ? categoriaApi : usuarioApi
    try {
      await guardarYRecargar(() => api.eliminar(id))
    } catch {
      return
    }
  }

  const tipoCatalogo = vista === 'categorias' ? 'categorias' : 'usuarios'
  const elementosCatalogo = tipoCatalogo === 'categorias' ? categorias : usuarios

  if (!token) {
    return <Login onAutenticado={() => {
      setError(null)
      setCargando(true)
      setToken(obtenerToken())
    }} />
  }

  return (
    <div className="app">
      <Header
        vista={vista}
        onCambiarVista={(nuevaVista) => {
          setVista(nuevaVista)
          setError(null)
        }}
        onNuevaTarea={() => setModalNueva(true)}
        onNuevoElemento={() => setCatalogoSeleccionado({ tipo: tipoCatalogo, elemento: null })}
        buscar={buscar}
        onCambiarBuscar={setBuscar}
        filPrioridad={filPrioridad}
        onCambiarPrioridad={setFilPrioridad}
        filCategoria={filCategoria}
        onCambiarCategoria={setFilCategoria}
        filUsuario={filUsuario}
        onCambiarUsuario={setFilUsuario}
        categorias={categorias}
        usuarios={usuarios}
        totalTareas={tareas.length}
        totalFiltradas={tareasFiltro.length}
        onLimpiarFiltros={limpiarFiltros}
        onCerrarSesion={() => {
          cerrarSesion()
          setToken(null)
        }}
      />

      {error && <p className="msg-error" role="alert">{error}</p>}

      {vista === 'tablero' && (
        cargando ? (
          <p className="msg-carga">Cargando tareas...</p>
        ) : (
          <>
            {tareas.length > 0 && tareasFiltro.length === 0 && (
              <div className="sin-resultados">
                <p>🔍 Ninguna tarea coincide con los filtros.</p>
                <button className="btn btn-primario" onClick={limpiarFiltros}>Limpiar filtros</button>
              </div>
            )}
            <Tablero
              tareas={tareasFiltro}
              onVerTarea={setTareaSeleccionada}
              onSoltarTarea={moverTarea}
            />
          </>
        )
      )}

      {vista !== 'tablero' && (
        <section className="catalogo">
          <div className="catalogo-titulo">
            <h1>{tipoCatalogo === 'categorias' ? 'Categorías' : 'Usuarios'}</h1>
            <p>Gestiona los datos relacionados con tus tareas.</p>
          </div>
          {cargando ? <p className="msg-carga">Cargando datos...</p> : (
            <div className="catalogo-lista">
              {elementosCatalogo.map((elemento) => {
                const id = tipoCatalogo === 'categorias' ? elemento.categoria_id : elemento.usuario_id
                const nombre = tipoCatalogo === 'categorias' ? elemento.nom_categoria : elemento.nom_usuario
                const relacionadas = tipoCatalogo === 'categorias'
                  ? tareas.filter((tarea) => Number(tarea.categoria_id) === Number(id)).length
                  : tareas.filter((tarea) => Number(tarea.usuario_id) === Number(id)).length
                return (
                  <article className="catalogo-elemento" key={id}>
                    <div>
                      <strong>{nombre}</strong>
                      <small>{relacionadas} {relacionadas === 1 ? 'tarea relacionada' : 'tareas relacionadas'}</small>
                    </div>
                    <div className="catalogo-acciones">
                      <button className="btn btn-secundario" onClick={() => setCatalogoSeleccionado({ tipo: tipoCatalogo, elemento })}>Editar</button>
                      <button className="btn btn-eliminar" onClick={() => eliminarElementoCatalogo(tipoCatalogo, elemento)}>Eliminar</button>
                    </div>
                  </article>
                )
              })}
              {elementosCatalogo.length === 0 && <p className="catalogo-vacio">No hay {tipoCatalogo} disponibles.</p>}
            </div>
          )}
        </section>
      )}

      {modalNueva && (
        <ModalNuevaTarea
          categorias={categorias}
          usuarios={usuarios}
          onCrear={agregarTarea}
          onCerrar={() => setModalNueva(false)}
        />
      )}

      {tareaSeleccionada && (
        <ModalTarjetaTarea
          tarea={tareaSeleccionada}
          categorias={categorias}
          usuarios={usuarios}
          onActualizar={editarTarea}
          onEliminar={eliminarTarea}
          onCerrar={() => setTareaSeleccionada(null)}
        />
      )}

      {catalogoSeleccionado && (
        <ModalCatalogo
          tipo={catalogoSeleccionado.tipo}
          elemento={catalogoSeleccionado.elemento}
          onGuardar={guardarElementoCatalogo}
          onCerrar={() => setCatalogoSeleccionado(null)}
        />
      )}
    </div>
  )
}

export default App
