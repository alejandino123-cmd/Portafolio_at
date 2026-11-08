# Gestor de Proyectos

## Introducción

Gestor de Proyectos es una aplicación web para guardar y organizar tus proyectos de software. Cada proyecto se registra con su descripción, estado, prioridad, fechas, tecnologías y repositorio. Además, se le agregan tareas y el sistema calcula solo el porcentaje de avance a partir de las tareas completadas.

Los datos se guardan en MongoDB, así que no se pierden al recargar la página ni al cerrar el navegador.

## Funciones principales

- Tabla de proyectos con tecnologías (con logo), estado, fecha de entrega, tareas y barra de avance. Muestra 5 proyectos por página.
- Crear y editar proyectos desde una ventana organizada por secciones.
- Buscador de tecnologías con sugerencias y logos.
- Pantalla de tareas por proyecto: agregar, marcar como completada y eliminar.
- Ventana de confirmación antes de eliminar un proyecto o una tarea.
- Vista **Mis proyectos** en tarjetas, con vista previa, buscador y filtro por estado.
- Pantalla de **Inicio** con el resumen de todos los proyectos.
- Diseño adaptable a computadora, tableta y celular.

## Tecnologías

**Frontend:** Vue 3 (Composition API y TypeScript), Vite, Pinia, Vue Router, Tailwind CSS 3, DaisyUI 3 y Devicon.

**Backend:** Node.js, Express, Mongoose y MongoDB.

## Estructura del proyecto

```
proyectos-at/
├── backend/
│   ├── models/Proyecto.js
│   ├── routes/proyectos.js
│   ├── .env
│   ├── package.json
│   └── server.js
└── frontend/
    ├── public/
    ├── src/
    │   ├── assets/main.css
    │   ├── components/
    │   ├── router/index.ts
    │   ├── stores/proyectos.ts
    │   ├── utils/tecnologias.ts
    │   ├── views/
    │   ├── App.vue
    │   ├── LayoutViews.vue
    │   └── main.ts
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.ts
```

## Requisitos

- Node.js 22.18 o superior (o 24.12 o superior).
- MongoDB Community Server instalado y en ejecución como servicio. MongoDB Compass es opcional.
- Una terminal (en Windows se usó Git Bash).

## Instalación y ejecución

El backend y el frontend deben estar corriendo al mismo tiempo, cada uno en su terminal.

**1. Backend**

```bash
cd backend
npm install
npm run dev
```

Crea el archivo `backend/.env` con este contenido:

```
MONGO_URI=mongodb://127.0.0.1:27017/gestor_proyectos
PORT=3000
```

Si todo está bien, la consola muestra "Conectado a MongoDB" y la dirección de la API.

**2. Frontend**

```bash
cd frontend
npm install
npm run dev
```

Abre http://localhost:5173 en el navegador.

Para generar la versión de producción del frontend: `npm run build`.

## Variables de entorno

| Dónde | Variable | Para qué sirve |
|---|---|---|
| `backend/.env` | `MONGO_URI` | Dirección de la base de datos |
| `backend/.env` | `PORT` | Puerto de la API (3000) |
| `frontend/.env` (opcional) | `VITE_API_URL` | Cambiar la dirección de la API. Por defecto es `http://localhost:3000/api` |

El archivo `.env` no se sube a Git.

## API REST

Dirección base: `http://localhost:3000/api/proyectos`

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/api/proyectos` | Lista todos los proyectos |
| POST | `/api/proyectos` | Crea un proyecto |
| PUT | `/api/proyectos/:id` | Edita un proyecto |
| DELETE | `/api/proyectos/:id` | Elimina un proyecto y sus tareas |
| POST | `/api/proyectos/:id/tareas` | Agrega una tarea (`{ titulo }`) |
| PATCH | `/api/proyectos/:id/tareas/:tareaId` | Marca o desmarca una tarea como completada |
| DELETE | `/api/proyectos/:id/tareas/:tareaId` | Elimina una tarea |

Las rutas de tareas devuelven el proyecto actualizado, por eso el avance se actualiza solo.

## Solución de problemas

- **`ECONNREFUSED 127.0.0.1:27017`:** MongoDB no está corriendo. Inicia el servicio de MongoDB Server.
- **"No hay conexión con el servidor" en pantalla:** el backend está apagado. Ejecuta `npm run dev` dentro de `backend`.
- **No aparecen los logos de las tecnologías:** ejecuta `npm install devicon`, reinicia Vite y recarga con Ctrl+F5.
- **Los estilos se ven mal tras actualizar:** reinicia `npm run dev` para que Tailwind cargue la configuración.

## Mejoras futuras

- Inicio de sesión y roles de usuario.
- Búsqueda y filtros en la tabla principal.
- Edición de tareas, fechas límite y responsables.
- Subir una captura propia de cada proyecto como vista previa.
- Pruebas automatizadas.
- Publicar el backend en un servicio de alojamiento y la base de datos en MongoDB Atlas.

## Conclusión

El proyecto reúne en un solo lugar el registro de los proyectos, su seguimiento por tareas y su presentación como portafolio. Está separado en un frontend (Vue) y un backend (Express y MongoDB) que se comunican por una API REST, lo que permite cambiar o publicar cada parte por separado.
