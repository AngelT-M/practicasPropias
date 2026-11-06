import { useState } from 'react'
import { iniciarSesion } from '../services/api'

export default function Login({ onAutenticado }) {
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function enviarFormulario(evento) {
    evento.preventDefault()
    setError('')
    setEnviando(true)

    try {
      await iniciarSesion(correo.trim(), password)
      onAutenticado()
    } catch (e) {
      setError(e.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <main className="login-pantalla">
      <form className="login-formulario" onSubmit={enviarFormulario}>
        <div className="login-marca" aria-hidden="true">📋</div>
        <h1>Gestión de Trabajo</h1>
        <p>Inicia sesión para acceder a tu tablero.</p>

        <label htmlFor="login-correo">Correo electrónico</label>
        <input
          id="login-correo"
          type="email"
          autoComplete="username"
          value={correo}
          onChange={(evento) => setCorreo(evento.target.value)}
          required
        />

        <label htmlFor="login-password">Contraseña</label>
        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(evento) => setPassword(evento.target.value)}
          required
        />

        {error && <p className="msg-error login-error" role="alert">{error}</p>}

        <button className="btn btn-primario login-boton" type="submit" disabled={enviando}>
          {enviando ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </button>
      </form>
    </main>
  )
}
