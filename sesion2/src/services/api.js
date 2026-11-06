// URL base de la API
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost/fs2026/gestion_de_proyectos/public/api';

// ── Token: se guarda en localStorage ──────────────────────────────────
export function obtenerToken() { return localStorage.getItem('token'); }
export function guardarToken(t) { localStorage.setItem('token', t); }
export function eliminarToken() { localStorage.removeItem('token'); }

// ── Función genérica que hace todas las peticiones HTTP ────────────────
async function peticion(ruta, { metodo = 'GET', datos, conToken = true } = {}) {

  const headers = { 'Content-Type': 'application/json', Accept: 'application/json' };
  if (conToken) {
    const token = obtenerToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const respuesta = await fetch(`${BASE_URL}/${ruta}`, {
    method: metodo,
    headers: headers,
    body: datos ? JSON.stringify(datos) : undefined,
  }).catch(() => { throw new Error('No se pudo conectar con el servidor'); });

  // 204 No Content (ej: delete exitoso) no tiene cuerpo
  if (respuesta.status === 204) return null;

  const json = await respuesta.json().catch(() => null);

  if (!respuesta.ok) {
    // CI4 devuelve errores en { exito: false, mensaje: "..." } o { message: "..." }
    const msg = json?.mensaje ?? json?.message ?? respuesta.statusText;
    throw new Error(msg);
  }

  // La API envuelve la respuesta en { exito: true, datos: {...} }
  // Si existe "datos", lo devolvemos directamente
  return json?.datos !== undefined ? json.datos : json;
}

// ── Auth ───────────────────────────────────────────────────────────────
// POST api/autenticacion/login  →  body: { usuario, contrasena }
// Responde: { token, tipo, usuario }
export const authApi = {
  login: (datos) => peticion('autenticacion/login', { metodo: 'POST', datos, conToken: false }),
  logout: () => peticion('autenticacion/logout', { metodo: 'POST' }),
};

// ── Proyectos ──────────────────────────────────────────────────────────
export const proyectoApi = {
  mostrar: () => peticion('proyectos'),
  buscar: (id) => peticion(`proyectos/${id}`),
  crear: (datos) => peticion('proyectos', { metodo: 'POST', datos }),
  actualizar: (id, datos) => peticion(`proyectos/${id}`, { metodo: 'PUT', datos }),
  eliminar: (id) => peticion(`proyectos/${id}`, { metodo: 'DELETE' }),
};

// ── Tareas (anidadas bajo un proyecto) ────────────────────────────────
export const tareaApi = {
  mostrar: (idProyecto) => peticion(`proyectos/${idProyecto}/tareas`),
  buscar: (idProyecto, id) => peticion(`proyectos/${idProyecto}/tareas/${id}`),
  crear: (idProyecto, datos) => peticion(`proyectos/${idProyecto}/t}areas`, { metodo: 'POST', datos }),
  actualizar: (idProyecto, id, datos) => peticion(`proyectos/${idProyecto}/tareas/${id}`, { metodo: 'PUT', datos }),
  eliminar: (idProyecto, id) => peticion(`proyectos/${idProyecto}/tareas/${id}`, { metodo: 'DELETE' }),
};

// ── Categorías ─────────────────────────────────────────────────────────
export const categoriaApi = {
  activas: () => peticion('categorias'),   // nueva API usa /categorias (sin /activas)
};