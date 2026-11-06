# Ruta de aprendizaje: construir el tablero de proyectos

Esta guía se centra en el orden de archivos para aprender a construir esta página. Asume que ya sabes crear el proyecto React y que el backend/API ya existe. La ruta empieza por el conector `api.js` y `App.jsx`, sigue con la selección de proyecto y el tablero con tarjetas, y deja los modales para el final.

## Orden recomendado

### 1. `src/services/api.js` — conector con el servidor

Empieza por identificar qué operaciones ofrece el backend:

- Iniciar y cerrar sesión.
- Listar proyectos.
- Listar tareas de un proyecto.
- Listar categorías.
- Crear, actualizar y eliminar tareas.

En este archivo estudia estas partes:

- `BASE_URL`: dirección base a la que se agregan las rutas.
- `peticion(...)`: función común que usa `fetch`, prepara encabezados, convierte el cuerpo a JSON, interpreta la respuesta y genera errores.
- `authApi`, `proyectoApi`, `tareaApi` y `categoriaApi`: funciones organizadas por recurso que llaman a `peticion`.
- `obtenerToken`, `guardarToken` y `eliminarToken`: funciones para leer, guardar y borrar el token en `localStorage`.

La función común evita repetir toda la lógica HTTP en cada operación. Por ejemplo, `tareaApi.mostrar(idProyecto)` construye la ruta de tareas del proyecto y delega el envío real a `peticion`.

### 2. `src/App.jsx` — componente principal y flujo general

Empieza creando el esqueleto de las pantallas y el estado que coordinará la app:

- Sesión y usuario.
- Proyectos y proyecto seleccionado.
- Tareas y categorías.
- Carga, errores y filtros.
- Estado de los modales.

Al principio puedes usar datos de prueba. Deja planteado el recorrido:

`sesión → selección de proyecto → tablero`

`App.jsx` es el coordinador: conserva estado compartido y pasa datos y funciones a los componentes por `props`. Lo comenzarás ahora, pero completarás su conexión después de crear las piezas visuales.

### 3. `src/components/Login.jsx` — iniciar sesión

Construye el formulario y conéctalo con `authApi.login`.

Conceptos que debes observar:

- `useState` guarda lo que se escribe en usuario y contraseña.
- `onChange` actualiza ese estado al escribir.
- `onSubmit` ejecuta la función de envío.
- `e.preventDefault()` impide que el formulario recargue la página.
- `try/catch/finally` permite mostrar errores y terminar el indicador de carga incluso si la petición falla.
- `onLoginExitoso(usuario)` avisa a `App.jsx` que el login tuvo éxito.

### 4. Selección de proyecto — implementarla en `src/App.jsx`

Muestra la lista que devuelve `proyectoApi.mostrar()`. Cada proyecto puede ser un botón o tarjeta. Al elegir uno, guarda el objeto seleccionado en el estado, por ejemplo con `setProyectoSeleccion(proyecto)`.

Ese cambio de estado hace que React vuelva a renderizar `App.jsx` y muestre la pantalla del tablero en lugar de la lista. En este proyecto la selección está dentro de `App.jsx`; no es obligatorio crear un archivo separado para ella.

### 5. `src/components/Header.jsx` — cabecera del tablero

Muestra el nombre del proyecto seleccionado y los controles del tablero:

- Volver a la selección de proyecto.
- Buscar tareas.
- Filtrar por prioridad y categoría.
- Abrir el formulario para crear una tarea.
- Cerrar sesión.

El Header recibe los valores y callbacks por props. Por ejemplo, al cambiar el texto llama a una función que recibió de `App.jsx`; el estado de búsqueda permanece en `App.jsx`, no dentro del Header.

### 6. `src/components/TarjetaTarea.jsx` — tarjeta individual

Recibe una tarea y muestra sus datos breves, como título, categoría, prioridad y fecha.

- El clic puede llamar `onVerTarea(tarea)` para que `App.jsx` sepa qué tarea se seleccionó.
- `draggable` habilita el arrastre.
- `onDragStart` guarda el ID de la tarea en `dataTransfer`, para que la columna de destino sepa cuál mover.

### 7. `src/components/ColumnaKanban.jsx` — columna del tablero

Recibe título, estado y tareas. Muestra las tarjetas que le entrega `Tablero.jsx`.

- `onDragOver` permite soltar un elemento en la columna.
- `onDrop` lee el ID guardado por la tarjeta y llama a `onSoltarTarea(id, estadoDestino)`.
- La columna no hace directamente la petición HTTP: notifica a `App.jsx`, que coordina la operación.

### 8. `src/components/Tablero.jsx` — distribuir tarjetas por estado

Define las columnas, por ejemplo pendiente, en proceso y completadas. Para cada columna filtra la lista de tareas por estado y pasa el resultado a `ColumnaKanban.jsx`.

Así la jerarquía visual queda:

`Tablero → ColumnaKanban → TarjetaTarea`

### 9. Volver a `src/App.jsx` — conectar selección y tablero con la API

Cuando ya tienes la selección y los componentes del tablero:

1. Al detectar usuario autenticado, llama `proyectoApi.mostrar()` y guarda el resultado en `proyectos`.
2. Al seleccionar un proyecto, `useEffect` detecta el cambio y llama a `tareaApi.mostrar(idProyecto)` y `categoriaApi.activas()`.
3. Guarda las respuestas en `tareas` y `categorias`.
4. Pasa esos datos al Header, al tablero y a los futuros modales.
5. Al soltar una tarjeta, llama a `tareaApi.actualizar(...)` para guardar el estado nuevo.
6. Muestra errores y carga mientras espera las respuestas.

`useEffect` se usa aquí para sincronizar React con el servidor cuando cambia una dependencia, como el usuario o el proyecto seleccionado. No es necesario hacer una petición dentro de cada renderizado.

### 10. `src/components/ModalTarjetaTarea.jsx` — ver y editar

Cuando ya funciona el tablero, agrega el modal de detalle:

1. Recibe la tarea seleccionada por props y muestra sus campos.
2. Agrega el modo edición con campos controlados por `useState`.
3. Al guardar, llama a un callback que recibe de `App.jsx`.
4. Agrega eliminación y pide confirmación antes de borrar.

El modal recoge la interacción; `App.jsx` llama a la API y actualiza la lista.

### 11. `src/components/ModalNuevaTarea.jsx` — crear una tarea

Déjalo para el final. Crea el formulario para título, descripción, categoría, prioridad y fecha. Al enviarlo:

1. Valida los datos del formulario.
2. Llama a `onCrear(datos)`, recibido por props.
3. `App.jsx` llama a `tareaApi.crear(...)`.
4. Después de guardar, `App.jsx` actualiza o vuelve a cargar las tareas.
5. Si hay error, el modal muestra el mensaje y conserva el formulario.

### 12. `src/App.css` y `src/index.css` — terminar presentación

Usa `App.css` para Header, selección, tablero, tarjetas y modales. Usa `index.css` para reglas globales, como reset y `box-sizing`. Puedes agregar estilos provisionales antes, pero ajusta el diseño completo cuando la estructura ya esté hecha.

`src/main.jsx` normalmente ya viene creado por React y monta `<App />` dentro de `#root`; no necesitas empezar modificándolo.

## Cómo viajan los datos dentro de React

Los componentes se comunican principalmente con props:

1. `App.jsx` conserva los datos en estado, por ejemplo `tareas`.
2. `App.jsx` pasa `tareas` a `Tablero`.
3. `Tablero` reparte subconjuntos a cada `ColumnaKanban`.
4. Cada columna pasa una tarea a `TarjetaTarea`.
5. Cuando el usuario interactúa, la tarjeta llama una función recibida por props.
6. Esa función llega hasta `App.jsx`, que actualiza el estado o solicita un cambio al servidor.
7. React detecta el nuevo estado y vuelve a dibujar los componentes afectados.

Resumen:

`App (estado) → props con datos → componentes hijos → evento → callback hacia App → nuevo estado → nuevo render`

Los datos fluyen hacia abajo por props; las acciones vuelven hacia el componente padre por callbacks.

## Cómo viaja y se valida el token

El token sirve para que el servidor relacione las siguientes peticiones con la sesión iniciada. El frontend lo guarda y lo envía; **la validación real de identidad y permisos le corresponde al backend**.

1. `Login.jsx` envía usuario y contraseña a `authApi.login(...)`.
2. `api.js` hace la petición de login sin token, porque todavía no se ha iniciado sesión (`conToken: false`).
3. Si el backend acepta las credenciales, responde con un token y los datos del usuario.
4. `Login.jsx` pasa el token a `guardarToken(...)`, que lo almacena en `localStorage`.
5. En cada petición protegida, `peticion(...)` lee el token con `obtenerToken()` y lo agrega al encabezado `Authorization`, usando el formato acordado con el backend.
6. El backend recibe la petición, valida el token y comprueba permisos antes de responder.
7. Si el token falta, expiró o no es válido, el backend debe rechazar la petición (normalmente con HTTP 401 o 403). `api.js` convierte la respuesta fallida en un error y `App.jsx` decide mostrarlo o cerrar la sesión.
8. Al salir, se llama al endpoint de logout y `eliminarToken()` quita el token del navegador.

Importante: encontrar un token en `localStorage` solo indica que hay un valor guardado; no demuestra que siga siendo válido. La prueba definitiva ocurre cuando el backend valida una petición protegida. El esquema del encabezado, como `Bearer`, debe coincidir exactamente con lo que espera tu backend.

## Pruebas por etapas

1. Verifica que cada función de `api.js` use la ruta, método y datos esperados.
2. Prueba login correcto, credenciales incorrectas y token vencido.
3. Comprueba que aparecen los proyectos y que al seleccionar uno se carga su tablero.
4. Verifica que las tareas se separan por estado.
5. Arrastra una tarea y confirma que el nuevo estado se guarda en el servidor.
6. Prueba búsqueda y filtros.
7. Al final, abre, edita, crea y elimina tareas.
8. Recarga la página para confirmar que los cambios guardados vienen nuevamente del servidor.
