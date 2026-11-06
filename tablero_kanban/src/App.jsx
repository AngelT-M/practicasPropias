import { use, useEffect, useState } from 'react'
import './App.css'
import { categoriaApi, tareaApi, usuarioApi } from './services/api';
import Header from './components/Header';
import Tablero from './components/Tablero';

function App() {
  const [tareas, setTareas] = useState([]);
  const [categorias, setCategoria] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  const [cargado, setCargado] = useState(true);
  const [error, setError] = useState(null);

  //filtros
  const [buscar, setBuscar] = useState('');
  const [filPrioridad, setFilPrioridad] = useState('TODAS');
  const [filCategoria, setFilCategoria] = useState('TODAS');
  const [filUsuario, setFilUsuario] = useState('TODAS');

  //acciones 
  const [modalNueva, setModalNueva] = useState(false);
  const [tareaSeleccion, setTareaSeleccion] = useState(null);

  const tareasFiltro= tareas.filter((t)=>{
    if (buscar) {
      const q = buscar.toLowerCase();
      const hayCoincidencia =
        t.titulo?.toLowerCase().includes(q)||
        t.descripcion?.toLowerCase().includes(q)||
        t.nom_categoria?.toLowerCase().includes(q)||
        t.nom_usuario?.toLowerCase().includes(q);
      if(!hayCoincidencia)return false;
    };
    if (filPrioridad !== 'TODAS' && t.prioridad !== filPrioridad)return false;
    if(filCategoria !== 'TODAS' && String(t.nom_categoria) !== String(filCategoria))return false;
    if(filUsuario !== 'TODAS' && String(t.nom_usuario) !== String(filUsuario))return false;
    return true;
  });

  function limpiarFiltro(){
    setBuscar('')
    setFilPrioridad('TODAS')
    setFilCategoria('TODAS')
    setFilUsuario('TODAS')
  }

  useEffect(()=>{
    async function cargar() {
      try{
        const [tareasMostrar, categoriasMostrar, usuariosMostrar] = await Promise.all([
          tareaApi.mostrar(),
          categoriaApi.mostrar(),
          usuarioApi.mostrar()
        ]);
        setTareas(tareasMostrar);
        setCategoria(categoriasMostrar);
        setUsuarios(usuariosMostrar);
      }
      catch(e){
        setError(e.message);
      }
      finally{
        setCargado(true);
      }
    }
    cargar();
  },[]);

  async function moverTarea(idTarea, nuevoEstado) {
    const tarea = tareas.find(t=> t.tarea_id === idTarea);
    if(!tarea || tareas.estado === nuevoEstado)return;

    const maxOrden = tareas
      .filter(t=> t.estado === nuevoEstado)
      .reduce((max, t)=> Math.max(max, t.orde ?? 0),0);

    try{
      await tareaApi.actualizar(idTarea, {estado:nuevoEstado,orden:maxOrden+1});
      setTareas(prev=>
        prev.map(t=> t.tarea_id === idTarea ? {...t, estado:nuevoEstado,orden:maxOrden+1}:t)
      );
    }
    catch(e){
      setError(e.message);
    }

  } 



  return (
    <div className='app'>
        <Header></Header>
        {error && <p>{error}</p>}

        {cargado ? (
          <p>Cargando tareas</p>
        ):(
          <>
          {tareas.length > 0 && tareasFiltro.length === 0 && (
            <div>
              <p>No hay coincidencias encontradas </p>
              <button onClick={limpiarFiltro}>Limpiar filtro</button>
            </div>
          )}

           <Tablero
            tareas={tareasFiltro}
            onVerTarea={setTareaSeleccion}
            onSoltarTarea={moverTarea}
           />

          </>
        )}

    </div>
 
  )

}

export default App
