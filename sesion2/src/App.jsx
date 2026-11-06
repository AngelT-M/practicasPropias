import { useEffect, useState } from "react";
import Login               from "./components/Login";
import Header              from "./components/Header";
import Tablero             from "./components/Tablero";
import ModalNuevaTarea     from "./components/ModalNuevaTarea";
import ModalTarjetaTarea   from "./components/ModalTarjetaTarea";
import { categoriaApi, tareaApi, proyectoApi, authApi, obtenerToken, eliminarToken } from "./services/api";
import './App.css';

function App() {
  // Estado compartido de la aplicación: App conserva datos y se los pasa a los componentes.
  // ── Sesión ───────────────────────────────────────────────────────────
  const [usuarioSesion, setUsuarioSesion] = useState(null);   // objeto usuario de la API
  const [tokenListo,    setTokenListo]    = useState(false);  // ¿ya revisamos localStorage?

  // ── Proyecto seleccionado ────────────────────────────────────────────
  const [proyectos,          setProyectos]          = useState([]);
  const [proyectoSeleccion,  setProyectoSeleccion]  = useState(null); // objeto proyecto activo

  // ── Datos del servidor ───────────────────────────────────────────────
  const [tareas,     setTareas]     = useState([]);
  const [categorias, setCategorias] = useState([]);

  const [cargando, setCargando] = useState(false);
  const [error,    setError]    = useState(null);

  // ── Filtros ──────────────────────────────────────────────────────────
  const [buscar,       setBuscar]       = useState('');
  const [filPrioridad, setFilPrioridad] = useState('TODAS');
  const [filCategoria, setFilCategoria] = useState('TODAS');

  // ── Control de modales ───────────────────────────────────────────────
  const [modalNueva,    setModalNueva]    = useState(false);
  const [tareaSeleccion, setTareaSeleccion] = useState(null);

  // Al iniciar, recupera una sesión anterior si existe un token en el navegador.
  useEffect(() => {
    const token = obtenerToken();
    if (token) {
      // Hubo login previo: cargamos proyectos directamente
      // (no tenemos los datos del usuario, ponemos un placeholder)
      setUsuarioSesion({ nombre: 'Usuario' });
    }
    setTokenListo(true);
  }, []);

  // Cuando hay usuario, pide sus proyectos a la API y guarda la respuesta en el estado.
  useEffect(() => {
    if (!usuarioSesion) return;
    async function cargarProyectos() {
      setCargando(true);
      setError(null);
      try {
        const lista = await proyectoApi.mostrar();
        // Nueva API devuelve { proyectos: [], paginacion: {} }
        setProyectos(Array.isArray(lista) ? lista : lista.proyectos ?? lista.data ?? []);
      } catch (e) {
        // Si el token expiró la API devuelve 401
        if (e.message.includes('401')) cerrarSesion();
        else setError(e.message);
      } finally {
        setCargando(false);
      }
    }
    cargarProyectos();
  }, [usuarioSesion]);

  // Al elegir un proyecto, solicita sus tareas y las categorías para mostrarlas o crear tareas.
  useEffect(() => {
    if (!proyectoSeleccion) { setTareas([]); setCategorias([]); return; }
    async function cargarDatos() {
      setCargando(true);
      setError(null);
      try {
        const [t, c] = await Promise.all([
          tareaApi.mostrar(proyectoSeleccion.id_proyecto),
          categoriaApi.activas(),
        ]);
        // Nueva API devuelve { tareas: [], paginacion: {} } y categorias como array directo
        setTareas(Array.isArray(t) ? t : t.tareas ?? t.data ?? []);
        setCategorias(Array.isArray(c) ? c : c.categorias ?? c.data ?? []);
      } catch (e) {
        if (e.message.includes('401')) cerrarSesion();
        else setError(e.message);
      } finally {
        setCargando(false);
      }
    }
    cargarDatos();
  }, [proyectoSeleccion]);

  // Los filtros se aplican en memoria; no se hace otra petición al escribir.
  const tareasFiltro = tareas.filter((t) => {
    if (buscar) {
      const q = buscar.toLowerCase();
      const coincide =
        t.titulo?.toLowerCase().includes(q) ||
        t.descripcion?.toLowerCase().includes(q) ||
        t.nom_categoria?.toLowerCase().includes(q);
      if (!coincide) return false;
    }
    if (filPrioridad !== 'TODAS' && t.prioridad !== filPrioridad) return false;
    if (filCategoria !== 'TODAS' && String(t.id_categoria) !== String(filCategoria)) return false;
    return true;
  });

  function limpiarFiltros() {
    setBuscar(''); 
    setFilPrioridad('TODAS'); 
    setFilCategoria('TODAS');
  }

  // Cierra la sesión en el servidor y limpia los datos locales de esta sesión.
  async function cerrarSesion() {
    try { await authApi.logout(); } catch { /* ignorar si el token ya expiró */ }
    eliminarToken();
    setUsuarioSesion(null);
    setProyectos([]);
    setProyectoSeleccion(null);
    setTareas([]);
  }

  // Login avisa al componente padre cuando la API acepta las credenciales.
  function manejarLoginExitoso(usuario) {
    setUsuarioSesion(usuario);
  }

  // Guarda el nuevo estado en el servidor y actualiza el tablero al soltar una tarjeta.
  async function moverTarea(idTarea, nuevoEstado) {
    const tarea = tareas.find(t => t.id_tarea === idTarea);
    if (!tarea || tarea.estado === nuevoEstado) return;
    try {
      await tareaApi.actualizar(proyectoSeleccion.id_proyecto, idTarea, { estado: nuevoEstado });
      setTareas(prev => prev.map(t => t.id_tarea === idTarea ? { ...t, estado: nuevoEstado } : t));
    } catch (e) { setError(e.message); }
  }

  // Envía la tarea nueva y vuelve a pedir la lista para reflejar los datos del servidor.
  async function agregarTarea(nueva) {
    try {
      await tareaApi.crear(proyectoSeleccion.id_proyecto, {
        titulo:       nueva.titulo,
        descripcion:  nueva.descripcion,
        id_categoria: Number(nueva.id_categoria),
        prioridad:    nueva.prioridad,
        estado:       nueva.estado ?? 'PENDIENTE',
        fecha_limite: nueva.fecha_limite || undefined,
      });
      const t = await tareaApi.mostrar(proyectoSeleccion.id_proyecto);
      setTareas(Array.isArray(t) ? t : t.tareas ?? t.data ?? []);
    } catch (e) { setError(e.message); throw e; }
  }

  // Actualiza la tarea y recarga la lista para sincronizar la interfaz con la API.
  async function editarTarea(idTarea, datos) {
    try {
      await tareaApi.actualizar(proyectoSeleccion.id_proyecto, idTarea, datos);
      const t = await tareaApi.mostrar(proyectoSeleccion.id_proyecto);
      setTareas(Array.isArray(t) ? t : t.tareas ?? t.data ?? []);
      setTareaSeleccion(null);
    } catch (e) { setError(e.message); }
  }

  // Elimina la tarea en la API y vuelve a cargar la lista del proyecto.
  async function eliminarTarea(idTarea) {
    try {
      await tareaApi.eliminar(proyectoSeleccion.id_proyecto, idTarea);
      const t = await tareaApi.mostrar(proyectoSeleccion.id_proyecto);
      setTareas(Array.isArray(t) ? t : t.tareas ?? t.data ?? []);
      setTareaSeleccion(null);
    } catch (e) { setError(e.message); throw e; }
  }

  // No muestra login o tablero hasta terminar de comprobar la sesión guardada.
  if (!tokenListo) return null;

  // Sin usuario autenticado, la pantalla activa es el formulario de login.
  if (!usuarioSesion) return <Login onLoginExitoso={manejarLoginExitoso} />;

  // Con sesión pero sin proyecto, muestra la lista para elegir el tablero de trabajo.
  if (!proyectoSeleccion) {
    return (
      <div className="app">
        <header className="app-header">
          <div className="header-fila">
            <span className="logo">🗂️ Gestión de Proyectos</span>
            <div className="usuario">
              <span className="avatar">
                {(usuarioSesion.nombre ?? usuarioSesion.usuario ?? 'U')[0].toUpperCase()}
              </span>
              <span>{usuarioSesion.nombre ?? usuarioSesion.usuario}</span>
              <button className="btn btn-cerrar" onClick={cerrarSesion}>Cerrar sesión</button>
            </div>
          </div>
        </header>

        {error    && <p className="msg-error">{error}</p>}
        {cargando && <p className="msg-carga">Cargando proyectos…</p>}

        {!cargando && (
          <div className="proyectos-lista">
            <h2 className="proyectos-titulo">Selecciona un proyecto</h2>
            {proyectos.length === 0
              ? <p className="msg-carga">No tienes proyectos asignados.</p>
              : proyectos.map(p => (
                  <div
                    key={p.id_proyecto}
                    className="proyecto-card"
                    onClick={() => setProyectoSeleccion(p)}
                  >
                    <div className="proyecto-card-header">
                      <span className="proyecto-nombre">{p.nombre}</span>
                      <span className={`badge-estado estado-${(p.estado ?? '').toLowerCase()}`}>
                        {p.estado}
                      </span>
                    </div>
                    {p.descripcion && <p className="proyecto-desc">{p.descripcion}</p>}
                    <div className="proyecto-fechas">
                      {p.fecha_inicio && <span>📅 Inicio: {p.fecha_inicio}</span>}
                      {p.fecha_fin    && <span>🏁 Fin: {p.fecha_fin}</span>}
                    </div>
                  </div>
                ))
            }
          </div>
        )}
      </div>
    );
  }

  // Proyecto seleccionado: conecta cabecera, tablero y modales con estado y acciones.
  return (
    <div className="app">
      <Header
        proyecto={proyectoSeleccion}
        onVolver={() => { setProyectoSeleccion(null); setTareas([]); }}
        onNuevaTarea={() => setModalNueva(true)}
        buscar={buscar}           onCambiarBuscar={setBuscar}
        filPrioridad={filPrioridad} onCambiarPrioridad={setFilPrioridad}
        filCategoria={filCategoria} onCambiarCategoria={setFilCategoria}
        categorias={categorias}
        totalTareas={tareas.length}
        totalFiltradas={tareasFiltro.length}
        onLimpiarFiltros={limpiarFiltros}
        usuario={usuarioSesion}
        onLogout={cerrarSesion}
      />

      {error && <p className="msg-error">{error}</p>}

      {cargando ? (
        <p className="msg-carga">Cargando tareas…</p>
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
            onVerTarea={setTareaSeleccion}
            onSoltarTarea={moverTarea}
          />
        </>
      )}

      {modalNueva && (
        <ModalNuevaTarea
          categorias={categorias}
          onCrear={agregarTarea}
          onCerrar={() => setModalNueva(false)}
        />
      )}

      {tareaSeleccion && (
        <ModalTarjetaTarea
          tarea={tareaSeleccion}
          categorias={categorias}
          onActualizar={editarTarea}
          onEliminar={eliminarTarea}
          onCerrar={() => setTareaSeleccion(null)}
        />
      )}
    </div>
  );
}

export default App;
