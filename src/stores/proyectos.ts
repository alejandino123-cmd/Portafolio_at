import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'

export const ESTADOS = [
  { value: 'planeacion', label: 'Planeación', badge: 'badge-info' },
  { value: 'desarrollo', label: 'En desarrollo', badge: 'badge-primary' },
  { value: 'pausado', label: 'Pausado', badge: 'badge-warning' },
  { value: 'finalizado', label: 'Finalizado', badge: 'badge-success' },
] as const

export const PRIORIDADES = [
  { value: 'baja', label: 'Baja' },
  { value: 'media', label: 'Media' },
  { value: 'alta', label: 'Alta' },
] as const

export type Estado = (typeof ESTADOS)[number]['value']
export type Prioridad = (typeof PRIORIDADES)[number]['value']

export interface Tarea {
  id: string
  titulo: string
  completada: boolean
}

// Lo que se llena en el formulario
export interface DatosProyecto {
  nombre: string
  descripcion: string
  estado: Estado
  prioridad: Prioridad
  tecnologias: string[]
  repositorio: string
  fechaInicio: string | null
  fechaEntrega: string | null
}

// Lo que devuelve la API
export interface Proyecto extends DatosProyecto {
  id: string
  tareas: Tarea[]
  tareasCompletas: number
  tareasTotales: number
}

async function peticion(ruta: string, options?: RequestInit) {
  let res: Response
  try {
    res = await fetch(`${API}${ruta}`, options)
  } catch {
    throw new Error('No hay conexión con el servidor. ¿El backend está corriendo en el puerto 3000?')
  }
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.message ?? `Error ${res.status}`)
  }
  return res
}

const JSON_HEADERS = { 'Content-Type': 'application/json' }

export const useProyectosStore = defineStore('proyectos', () => {
  const proyectos = ref<Proyecto[]>([])
  const cargando = ref(false)
  const error = ref('')

  const total = computed(() => proyectos.value.length)

  const avance = (p: Proyecto) =>
    p.tareasTotales === 0 ? 0 : Math.round((p.tareasCompletas / p.tareasTotales) * 100)

  function reemplazar(actualizado: Proyecto) {
    const i = proyectos.value.findIndex(p => p.id === actualizado.id)
    if (i !== -1) proyectos.value[i] = actualizado
  }

  async function cargar() {
    cargando.value = true
    error.value = ''
    try {
      const res = await peticion('/proyectos')
      proyectos.value = await res.json()
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      cargando.value = false
    }
  }

  async function crear(datos: DatosProyecto) {
    const res = await peticion('/proyectos', {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify(datos),
    })
    proyectos.value.push(await res.json())
  }

  async function actualizar(id: string, datos: DatosProyecto) {
    const res = await peticion(`/proyectos/${id}`, {
      method: 'PUT',
      headers: JSON_HEADERS,
      body: JSON.stringify(datos),
    })
    reemplazar(await res.json())
  }

  async function eliminar(id: string) {
    await peticion(`/proyectos/${id}`, { method: 'DELETE' })
    proyectos.value = proyectos.value.filter(p => p.id !== id)
  }

  async function agregarTarea(proyectoId: string, titulo: string) {
    const res = await peticion(`/proyectos/${proyectoId}/tareas`, {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify({ titulo }),
    })
    reemplazar(await res.json())
  }

  async function toggleTarea(proyectoId: string, tareaId: string) {
    const res = await peticion(`/proyectos/${proyectoId}/tareas/${tareaId}`, { method: 'PATCH' })
    reemplazar(await res.json())
  }

  async function eliminarTarea(proyectoId: string, tareaId: string) {
    const res = await peticion(`/proyectos/${proyectoId}/tareas/${tareaId}`, { method: 'DELETE' })
    reemplazar(await res.json())
  }

  return {
    proyectos, cargando, error, total, avance,
    cargar, crear, actualizar, eliminar, agregarTarea, toggleTarea, eliminarTarea,
  }
})