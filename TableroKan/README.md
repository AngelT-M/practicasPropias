# Tablero Kanban

Interfaz React que conserva la estructura y el estilo sencillo de `sesion2` y consume la API REST de CodeIgniter 4.

## Ejecutar

```bash
npm install
npm run dev
```

La raíz de la API se configura con `VITE_API_BASE_URL` en `.env.local`. Por defecto se usa:

```dotenv
VITE_API_BASE_URL=http://localhost/fs2026/kanba_bd/api
```

Durante el desarrollo y con `npm run preview`, Vite reenvía las solicitudes `/api` a esa raíz para evitar errores CORS del navegador. Si la aplicación se despliega como sitio estático fuera de Vite, configura `VITE_API_BASE_URL` con la URL de la API y habilita CORS en el servidor para el origen del frontend.

No copies contraseñas ni tokens en variables `VITE_*`: Vite las incluye en el código que recibe el navegador.

## Funciones

- Tablero de tres columnas: `PENDIENTE`, `EN_PROCESO` y `COMPLETA`.
- Arrastrar y soltar tareas; el nuevo estado se persiste con `PUT`.
- Crear, consultar, editar y eliminar tareas.
- Búsqueda y filtros por prioridad, categoría y usuario.
- Consultar, crear, editar y eliminar categorías y usuarios.
- Inicio de sesión con token Bearer y cierre de sesión.
- Los errores y respuestas fallidas del servidor se muestran en la interfaz.

## Rutas consumidas

| Recurso | Rutas |
| --- | --- |
| Autenticación | `POST /login` |
| Tareas | `GET /tareas`, `GET /tareaBuscar/{id}`, `POST /tareaCrear`, `PUT /tareaActualizar/{id}`, `DELETE /tareaEliminar/{id}` |
| Categorías | `GET /categorias`, `GET /categoriaBuscar/{id}`, `POST /categoriaCrear`, `PUT /categoriaActualizar/{id}`, `DELETE /categoriaEliminar/{id}` |
| Usuarios | `GET /usuarios`, `GET /usuarioBuscar/{id}`, `POST /usuarioCrear`, `PUT /usuarioActualizar/{id}`, `DELETE /usuarioEliminar/{id}` |

El login envía `correo` y `password` y guarda el `access_token` en el almacenamiento de sesión del navegador. Las demás solicitudes incluyen `Authorization: Bearer <token>`. Al cerrar sesión o recibir un `401`, el token se elimina. Las respuestas actuales de listas están envueltas en `data`; la SPA adapta los IDs y nombres de tareas, categorías y usuarios a sus componentes, y traduce `COMPLETADA` a `COMPLETA` para el tablero.

Carga `DatabaseSeeder` desde el backend para crear el usuario de prueba. El token estático del backend es solo para pruebas. La contraseña solo se envía al endpoint de login y no se guarda en el navegador.

## Comprobaciones

```bash
npm run lint
npm run build
```
