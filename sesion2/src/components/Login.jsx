import { useState } from 'react';
import { authApi, guardarToken } from '../services/api';

// ── Pantalla de inicio de sesión ──────────────────────────────────────
function Login({ onLoginExitoso }) {
  // Cada campo controlado guarda su valor en React hasta enviar el formulario.
  const [usuario,   setUsuario]   = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error,     setError]     = useState(null);
  const [cargando,  setCargando]  = useState(false);

  async function manejarEnvio(e) {
    // Evita que el navegador recargue la página al enviar el formulario.
    e.preventDefault();
    setError(null);
    setCargando(true);
    try {
      const res = await authApi.login({ usuario, contrasena });
      guardarToken(res.token);           // guarda el Bearer token
      // Notifica al padre para que cambie de la pantalla de login a la aplicación.
      onLoginExitoso(res.usuario);       // sube el usuario al padre
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="login-fondo">
      <form className="login-caja" onSubmit={manejarEnvio}>
        <h1 className="login-titulo">🗂️ Gestión de Proyectos</h1>
        <p className="login-subtitulo">Inicia sesión para continuar</p>

        {error && <p className="login-error">{error}</p>}

        <label className="campo-label">
          Usuario
          <input
            className="campo-input"
            type="text"
            value={usuario}
            onChange={e => setUsuario(e.target.value)}
            placeholder="Tu nombre de usuario"
            required
            autoFocus
          />
        </label>

        <label className="campo-label">
          Contraseña
          <input
            className="campo-input"
            type="password"
            value={contrasena}
            onChange={e => setContrasena(e.target.value)}
            placeholder="••••••••"
            required
          />
        </label>

        <button className="btn btn-primario login-btn" type="submit" disabled={cargando}>
          {cargando ? 'Entrando…' : 'Iniciar sesión'}
        </button>
      </form>
    </div>
  );
}

export default Login;
