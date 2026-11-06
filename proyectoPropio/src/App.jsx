
import './App.css'
import { Routes, Route } from 'react-router-dom'
import EditorImagenes from './pages/editorImagenes'
import Inicio from './pages/Inicio'

function App() {

  return (
    <Routes>
      <Route path='/' element={<Inicio/>}></Route>
      <Route path='/editor' element={<EditorImagenes/>} ></Route>
    </Routes>
  )
}

export default App
