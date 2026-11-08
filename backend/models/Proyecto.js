import mongoose from 'mongoose'

const toJSON = {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.__v
    return ret
  },
}

const tareaSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true, trim: true },
    completada: { type: Boolean, default: false },
  },
  { toJSON }
)

const proyectoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
      minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
      maxlength: [100, 'El nombre no puede pasar de 100 caracteres'],
    },
    descripcion: { type: String, trim: true, default: '', maxlength: 500 },
    estado: {
      type: String,
      enum: ['planeacion', 'desarrollo', 'pausado', 'finalizado'],
      default: 'planeacion',
    },
    prioridad: { type: String, enum: ['baja', 'media', 'alta'], default: 'media' },
    tecnologias: { type: [String], default: [] },
    repositorio: {
      type: String,
      trim: true,
      default: '',
      validate: {
        validator: v => !v || /^https?:\/\/\S+$/i.test(v),
        message: 'El repositorio debe ser una URL válida (http o https)',
      },
    },
    fechaInicio: { type: Date, default: null },
    fechaEntrega: { type: Date, default: null },
    tareas: [tareaSchema],
  },
  { timestamps: true, toJSON }
)

proyectoSchema.virtual('tareasTotales').get(function () {
  return this.tareas.length
})
proyectoSchema.virtual('tareasCompletas').get(function () {
  return this.tareas.filter(t => t.completada).length
})

export default mongoose.model('Proyecto', proyectoSchema)