const BASE_URL = (
  import.meta.env.DEV
    ? '/api'
    : import.meta.env.VITE_API_BASE_URL
      ?? 'http://localhost/fs2026/kanba_bd/api'
).replace(/\/+$/, '')
const TOKEN_KEY = 'tablero-kanban-access-token'

export function obtenerToken() {
  return sessionStorage.getItem(TOKEN_KEY)
}

export function cerrarSesion() {
  sessionStorage.removeItem(TOKEN_KEY)
}

export async function iniciarSesion(correo, password) {
  const respuesta = await peticion('login', {
    metodo: 'POST',
    datos: { correo, password },
  })

  if (typeof respuesta?.access_token !== 'string' || !respuesta.access_token) {
    throw new Error('La respuesta de la API no incluye un token de acceso válido.')
  }

  sessionStorage.setItem(TOKEN_KEY, respuesta.access_token)
  return respuesta
}

function obtenerMensajeError(datos, respuesta) {
  if (typeof datos === 'string' && datos.trim()) return datos
  if (datos?.message) return datos.message

  const mensajes = datos?.messages
  if (typeof mensajes === 'string') return mensajes
  if (mensajes && typeof mensajes === 'object') {
    return Object.values(mensajes).flat().join(' ')
  }

  return `Error ${respuesta.status}: ${respuesta.statusText || 'Error en la solicitud'}`
}

function extraerLista(respuesta, recurso) {
  const lista = Array.isArray(respuesta) ? respuesta : respuesta?.data
  if (!Array.isArray(lista)) {
    throw new Error(`La API devolvió ${recurso} con un formato inesperado.`)
  }
  return lista
}

async function peticion(ruta, { metodo = 'GET', datos } = {}) {
  let respuesta

  try {
    const token = ruta === 'login' ? null : obtenerToken()
    respuesta = await fetch(`${BASE_URL}/${ruta}`, {
      method: metodo,
      headers: {
        Accept: 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(datos === undefined ? {} : { 'Content-Type': 'application/json' }),
      },
      body: datos === undefined ? undefined : JSON.stringify(datos),
    })
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('No se pudo conectar con la API. Revisa la URL y que el servidor esté disponible.')
    }
    throw error
  }

  const texto = await respuesta.text()
  let contenido = texto
  if (texto) {
    try {
      contenido = JSON.parse(texto)
    } catch {
      if (!respuesta.ok) {
        throw new Error(obtenerMensajeError(texto, respuesta))
      }
    }
  } else {
    contenido = null
  }

  if (!respuesta.ok) {
    if (respuesta.status === 401 && ruta !== 'login') {
      cerrarSesion()
      window.dispatchEvent(new Event('api:unauthorized'))
    }
    throw new Error(obtenerMensajeError(contenido, respuesta))
  }

  return contenido
}

export const tareaApi = {
  mostrar: async () => extraerLista(await peticion('tareas'), 'tareas').map((tarea, index) => ({
    ...tarea,
    tarea_id: Number(tarea.id),
    categoria_id: Number(tarea.categoria_id),
    nom_categoria: tarea.categoria?.nombre ?? '',
    usuario_id: Number(tarea.asignado_a),
    nom_usuario: tarea.usuario_asignado?.nombre ?? '',
    estado: tarea.estado === 'COMPLETADA' ? 'COMPLETA' : tarea.estado,
    orden: Number(tarea.orden ?? index),
  })),
  buscar: (id) => peticion(`tareaBuscar/${id}`),
  crear: (datos) => peticion('tareaCrear', { metodo: 'POST', datos }),
  actualizar: (id, datos) => peticion(`tareaActualizar/${id}`, { metodo: 'PUT', datos }),
  eliminar: (id) => peticion(`tareaEliminar/${id}`, { metodo: 'DELETE' }),
}

export const categoriaApi = {
  mostrar: async () => extraerLista(await peticion('categorias'), 'categorías').map((categoria) => ({
    ...categoria,
    categoria_id: Number(categoria.id),
    nom_categoria: categoria.nombre,
  })),
  buscar: (id) => peticion(`categoriaBuscar/${id}`),
  crear: (datos) => peticion('categoriaCrear', { metodo: 'POST', datos }),
  actualizar: (id, datos) => peticion(`categoriaActualizar/${id}`, { metodo: 'PUT', datos }),
  eliminar: (id) => peticion(`categoriaEliminar/${id}`, { metodo: 'DELETE' }),
}

export const usuarioApi = {
  mostrar: async () => extraerLista(await peticion('usuarios'), 'usuarios').map((usuario) => ({
    ...usuario,
    usuario_id: Number(usuario.id),
    nom_usuario: usuario.nombre,
  })),
  buscar: (id) => peticion(`usuarioBuscar/${id}`),
  crear: (datos) => peticion('usuarioCrear', { metodo: 'POST', datos }),
  actualizar: (id, datos) => peticion(`usuarioActualizar/${id}`, { metodo: 'PUT', datos }),
  eliminar: (id) => peticion(`usuarioEliminar/${id}`, { metodo: 'DELETE' }),
}
