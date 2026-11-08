import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import proyectosRouter from './routes/proyectos.js'

const app = express()

app.use(cors())
app.use(express.json())
app.use('/api/proyectos', proyectosRouter)

// Errores: responde JSON con un mensaje claro en vez de tumbar el servidor
app.use((err, _req, res, _next) => {
  if (err.name === 'ValidationError') {
    const mensaje = Object.values(err.errors).map(e => e.message).join('. ')
    return res.status(400).json({ message: mensaje })
  }
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Dato o id inválido' })
  }
  console.error(err)
  res.status(500).json({ message: 'Error interno del servidor' })
})

try {
  await mongoose.connect(process.env.MONGO_URI)
  console.log('✅ Conectado a MongoDB')
  app.listen(process.env.PORT, () =>
    console.log(`🚀 API en http://localhost:${process.env.PORT}/api/proyectos`)
  )
} catch (err) {
  console.error('❌ No se pudo conectar a MongoDB:', err.message)
  process.exit(1)
}