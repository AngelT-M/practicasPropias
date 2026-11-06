import { useEffect, useState } from 'react'
import './App.css'
import { obToken } from './services/api';


function App() {

  const [userSesion, setUserSesion] = useState(null);
  const [tokenList, setTokenList] = useState(false);

  const [proyecto, setProyecto] = useState([]);
  const [proyectoSelect, setProyectoSelect] = useState(null);

  const [tareas, setTareas ] = useState([]);
  const [categoria, setCategoria] = useState([]);

  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(null);

  const [buscar, setBuscar] = useState('');
  const [filPrioridad, setFilPriorida] = useState('TODAS');
  const [filCategoria, setFilCategoria] = useState('TODAS');

  const [modalNueva, setModalNueva] = useState(false);
  const [tareaSelecion, setTareaSeleccion] = useState(null);

  useEffect(()=>{
    const token = obToken();
    if (token) {
      setUserSesion({nombre: 'usuario'});
    }
    setTokenList(true);
  },[]);



  return (
    <>
     
    </>
  )
}

export default App
