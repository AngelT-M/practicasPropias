const BASE_URL = import.meta.en.VITE_API_BASE_URL ?? 'http://localhost/fs2026/gestion_de_proyectos/public/api';

export function obToken(){return localStorage.getItem('token');}
export function guarToken(t){localStorage.setItem(`token`, t);}
export function delToken(){localStorage.removeItem('tokne');}

async function  peticion(ruta, {metodo='GET', datos, conToken= true}) {
    const headers = {'Contet-Type': 'Application/json', Accpt:'Application/json'};

    if (conToken) {
        const token = obToken();
        if(token) headers['Authorization'] = `Bearer ${token}`;
    }

    const respuesta = await fetch(`${BASE_URL}/${ruta}`,{
        method:metodo,
        headers: headers,
        body: datos ? JSON.stringify(datos): undefined
    }).catch(()=>{
        throw new Error('No hay conexion al servidor');
    });

    if(respuesta === 204)return null;

    const json = await respuesta.json().catch(()=>null);

    if (! respuesta.ok) {
        const smg = json?.mensaje ?? json?.message ?? respuesta.statusText;
        throw new Error(smg);
    }

    return json.datos !== undefined ? json.datos: json;



}




export const AuthApi={
    login: (datos)=>peticion('Autenticacion/login',{metodo:'POST',datos, conToken:false}),
    logout: ()=>peticion('Autenticacion/logout',{metodo:'POST'})
}

export const protectoApi ={
    mostrar: ()=>peticion('proyectos'),
    buscar: (id)=>peticion(`proyectos/${id}`),
    crear: (datos)=>peticion(`proyectos`,{metodo:'POST', datos}),
    actualizar: (id, datos)=>peticion(`proyectos/${id}`,{metodo:'PUT',datos}),
    eliminar: (id)=>peticion(`proyectos/${id}`,{metodo:'DELETE'})
}

export const tareaApi ={
    mostrar: (idProyecto)=>peticion(`proyectos/${idProyecto}/tareas`),
    buscar: (idProyecto,id)=>peticion(`proyectos/${idProyecto}/tareas/${id}`),
    crear: (idProyecto,datos)=>peticion(`proyectos/${idProyecto}/tareas`,{metodo:'POST', datos}),
    actualizar: (idProyecto,id, datos)=>peticion(`proyectos/${idProyecto}/tareas/${id}`,{metodo:'PUT',datos}),
    eliminar: (idProyecto,id)=>peticion(`proyectos/${idProyecto}/tareas/${id}`,{metodo:'DELETE'})
}

export const categoriaApi={
    activas: ()=>peticion('categorias')
}