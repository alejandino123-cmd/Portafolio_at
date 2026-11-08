import { Router } from 'express'
import Proyecto from '../models/Proyecto.js'

const router = Router()

// Envuelve los handlers async para que cualquier error llegue al middleware de errores
const ah = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

// Solo se aceptan estos campos del body (y se limpian)
const CAMPOS = [
  'nombre', 'descripcion', 'estado', 'prioridad',
  'tecnologias', 'repositorio', 'fechaInicio', 'fechaEntrega',
]

function datos(body = {}) {
  const out = {}
  for (const c of CAMPOS) {
    if (!(c in body)) continue
    let v = body[c]
    if (c.startsWith('fecha') && v === '') v = null
    if (c === 'tecnologias') {
      v = (Array.isArray(v) ? v : []).map(t => String(t).trim()).filter(Boolean)
    }
    out[c] = v
  }
  return out
}

const noEncontrado = (res, que = 'Proyecto') =>
  res.status(404).json({ message: `${que} no encontrado` })

// Listar
router.get('/', ah(async (_req, res) => {
  res.json(await Proyecto.find().sort({ createdAt: 1 }))
}))

// Crear
router.post('/', ah(async (req, res) => {
  res.status(201).json(await Proyecto.create(datos(req.body)))
}))

// Editar
router.put('/:id', ah(async (req, res) => {
  const proyecto = await Proyecto.findByIdAndUpdate(req.params.id, datos(req.body), {
    new: true,
    runValidators: true,
  })
  if (!proyecto) return noEncontrado(res)
  res.json(proyecto)
}))

// Eliminar
router.delete('/:id', ah(async (req, res) => {
  const eliminado = await Proyecto.findByIdAndDelete(req.params.id)
  if (!eliminado) return noEncontrado(res)
  res.status(204).end()
}))

// Agregar tarea
router.post('/:id/tareas', ah(async (req, res) => {
  const { titulo } = req.body
  if (!titulo?.trim()) return res.status(400).json({ message: 'El título es obligatorio' })
  const proyecto = await Proyecto.findById(req.params.id)
  if (!proyecto) return noEncontrado(res)
  proyecto.tareas.push({ titulo })
  await proyecto.save()
  res.status(201).json(proyecto)
}))

// Marcar / desmarcar tarea
router.patch('/:id/tareas/:tareaId', ah(async (req, res) => {
  const proyecto = await Proyecto.findById(req.params.id)
  const tarea = proyecto?.tareas.id(req.params.tareaId)
  if (!tarea) return noEncontrado(res, 'Tarea')
  tarea.completada = !tarea.completada
  await proyecto.save()
  res.json(proyecto)
}))

// Eliminar tarea
router.delete('/:id/tareas/:tareaId', ah(async (req, res) => {
  const proyecto = await Proyecto.findById(req.params.id)
  if (!proyecto?.tareas.id(req.params.tareaId)) return noEncontrado(res, 'Tarea')
  proyecto.tareas.pull({ _id: req.params.tareaId })
  await proyecto.save()
  res.json(proyecto)
}))

export default router