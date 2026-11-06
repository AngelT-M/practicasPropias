const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost/fs2026/tablero_kanban/public/api';

async function peticion(ruta,{metodo='GET',datos}={}) {
    
    const respuestas = await fetch(`${BASE_URL}/${ruta}`,{
        method: metodo,
        headers: {'Content-Type':'Application/json', Accept:'Application/json'},
        body: datos ? JSON.stringify(datos):undefined
    }).catch(()=>{
        throw new Error('No hay conexion al servidor');
    });

    const json = await respuestas.json().catch(()=>null);

    if (!respuestas.ok) {
        const ms = json?.message ?? json?.messages
        ? Object.values(json.messages ?? {}).join(' ')
        : respuestas.statusText;
        throw new Error(`Erro ${respuestas.status}: ${ms}`);
    }
    return json;
}


export const tareaApi = {
  mostrar: () => peticion('tareas'),
  crear: (datos) => peticion('tareaCrear', { metodo: 'POST', datos }),
  actualizar: (id, datos) => peticion(`tareaActualizar/${id}`, { metodo: 'PUT', datos }),
  eliminar: (id) => peticion(`tareaEliminar/${id}`, { metodo: 'DELETE' }),
};

// ── Categorías ────────────────────────────────────────────────────────
export const categoriaApi = {
  mostrar: () => peticion('categorias'),
};

// ── Usuarios ──────────────────────────────────────────────────────────
export const usuarioApi = {
  mostrar: () => peticion('usuarios'),
};
