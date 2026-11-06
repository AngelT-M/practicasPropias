import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import { Route, Router, Routes } from 'react-router-dom'
import EditorImagen from './pages/EditorImagen'
import Inicio from './pages/Inicio'

function App() {
  const [galeria, setGaleria] = useState([]);


  return (
    <Routes>
      <Route path='/' element={<EditorImagen setGaleria={setGaleria}  />} ></Route>
      <Route path='/inicio' element={<Inicio galeria={galeria}   />} ></Route>
    </Routes>
  
  )
}

export default App
