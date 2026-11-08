<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import {
  useProyectosStore,
  ESTADOS,
  PRIORIDADES,
  type DatosProyecto,
  type Proyecto,
} from '../stores/proyectos'
import { buscarTecnologia, normalizar, sugerir, type Opcion } from '../utils/tecnologias'
import TechBadge from './TechBadge.vue'
import TechIcon from './TechIcon.vue'

const props = defineProps<{ abierto: boolean; proyecto?: Proyecto | null }>()
const emit = defineEmits<{ (e: 'cerrar'): void }>()

const store = useProyectosStore()

const vacio = (): DatosProyecto => ({
  nombre: '',
  descripcion: '',
  estado: 'planeacion',
  prioridad: 'media',
  tecnologias: [],
  repositorio: '',
  fechaInicio: null,
  fechaEntrega: null,
})

const form = reactive<DatosProyecto>(vacio())
const guardando = ref(false)
const errores = reactive({ nombre: '', repositorio: '', fechas: '', general: '' })

function limpiarErrores() {
  errores.nombre = ''
  errores.repositorio = ''
  errores.fechas = ''
  errores.general = ''
}

// ---- Buscador de tecnologías ----
const busqueda = ref('')
const listaAbierta = ref(false)
const indice = ref(0) // opción resaltada
const navegado = ref(false) // true si se usaron las flechas
const listaEl = ref<HTMLElement | null>(null)

const opciones = computed(() => sugerir(busqueda.value, form.tecnologias))

// Al cambiar lo escrito o lo elegido, la selección vuelve a la primera opción
watch(opciones, () => {
  indice.value = 0
  navegado.value = false
})

// Mantiene visible la opción resaltada al moverse con las flechas
watch(indice, async () => {
  await nextTick()
  listaEl.value?.querySelector('[data-activo="true"]')?.scrollIntoView?.({ block: 'nearest' })
})

const activo = (i: number) => (busqueda.value.trim() !== '' || navegado.value) && i === indice.value

function elegir(op?: Opcion) {
  if (!op) return
  if (!form.tecnologias.some(t => normalizar(t) === normalizar(op.nombre))) {
    form.tecnologias.push(op.nombre)
  }
  busqueda.value = '' // se limpia para buscar la siguiente
  listaAbierta.value = true
}

function quitarTec(t: string) {
  form.tecnologias = form.tecnologias.filter(x => x !== t)
}

// Si quedó algo escrito sin elegir, se agrega al guardar
function agregarPendiente() {
  const texto = busqueda.value.trim()
  if (!texto) return
  const t = buscarTecnologia(texto)
  elegir({ nombre: t?.nombre ?? texto, icono: t?.icono ?? null })
}

function onKeydown(e: KeyboardEvent) {
  const n = opciones.value.length
  if (e.key === 'ArrowDown' && n) {
    e.preventDefault()
    listaAbierta.value = true
    navegado.value = true
    indice.value = (indice.value + 1) % n
  } else if (e.key === 'ArrowUp' && n) {
    e.preventDefault()
    navegado.value = true
    indice.value = (indice.value - 1 + n) % n
  } else if (e.key === 'Enter') {
    e.preventDefault() // evita enviar/cerrar por accidente
    if (busqueda.value.trim() !== '' || navegado.value) elegir(opciones.value[indice.value])
  } else if (e.key === 'Escape' && listaAbierta.value) {
    e.stopPropagation() // cierra solo la lista, no la ventana
    listaAbierta.value = false
  }
}

// Cada vez que se abre la ventana, se carga el proyecto a editar (o un formulario vacío)
watch(
  () => props.abierto,
  abierto => {
    if (!abierto) return
    limpiarErrores()
    busqueda.value = ''
    listaAbierta.value = false
    const p = props.proyecto
    Object.assign(
      form,
      p
        ? {
            nombre: p.nombre,
            descripcion: p.descripcion ?? '',
            estado: p.estado,
            prioridad: p.prioridad,
            tecnologias: [...(p.tecnologias ?? [])],
            repositorio: p.repositorio ?? '',
            fechaInicio: p.fechaInicio ? p.fechaInicio.slice(0, 10) : null,
            fechaEntrega: p.fechaEntrega ? p.fechaEntrega.slice(0, 10) : null,
          }
        : vacio()
    )
  }
)

// Cerrar la ventana con Esc
function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.abierto) emit('cerrar')
}
onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))

// ---- Guardar ----
function validar() {
  limpiarErrores()
  if (form.nombre.trim().length < 3) errores.nombre = 'El nombre debe tener al menos 3 caracteres'
  if (form.repositorio.trim() && !/^https?:\/\/\S+$/i.test(form.repositorio.trim()))
    errores.repositorio = 'Escribe una URL válida, por ejemplo https://github.com/usuario/repo'
  if (form.fechaInicio && form.fechaEntrega && form.fechaEntrega < form.fechaInicio)
    errores.fechas = 'La fecha de entrega no puede ser anterior a la de inicio'
  return !errores.nombre && !errores.repositorio && !errores.fechas
}

async function guardar() {
  agregarPendiente()
  if (!validar()) return
  guardando.value = true
  try {
    const datos: DatosProyecto = {
      ...form,
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim(),
      repositorio: form.repositorio.trim(),
      fechaInicio: form.fechaInicio || null,
      fechaEntrega: form.fechaEntrega || null,
    }
    if (props.proyecto) await store.actualizar(props.proyecto.id, datos)
    else await store.crear(datos)
    emit('cerrar')
  } catch (e) {
    errores.general = (e as Error).message
  } finally {
    guardando.value = false
  }
}
</script>

<template>
  <div v-if="abierto" class="modal modal-open">
    <div class="modal-box w-11/12 max-w-3xl max-h-[90vh]">
      <!-- Encabezado -->
      <div class="flex items-start justify-between mb-4">
        <div>
          <h3 class="font-bold text-xl text-primary">
            {{ proyecto ? 'Editar proyecto' : 'Nuevo proyecto' }}
          </h3>
          <p class="text-sm text-gray-500">Los campos con * son obligatorios.</p>
        </div>
        <button type="button" class="btn btn-sm btn-circle btn-ghost" @click="emit('cerrar')">✕</button>
      </div>

      <div v-if="errores.general" class="alert alert-error mb-4">{{ errores.general }}</div>

      <div class="space-y-6">
        <!-- 1. Información general -->
        <section>
          <h4 class="text-xs font-semibold uppercase tracking-wide opacity-60 mb-2">Información general</h4>
          <div class="space-y-3">
            <div>
              <label class="block text-sm font-medium mb-1" for="p-nombre">Nombre *</label>
              <input
                id="p-nombre"
                v-model="form.nombre"
                type="text"
                maxlength="100"
                placeholder="Ej: Sistema de reservas"
                class="input input-bordered w-full"
                :class="{ 'input-error': errores.nombre }"
              />
              <p v-if="errores.nombre" class="text-error text-xs mt-1">{{ errores.nombre }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1" for="p-desc">Descripción</label>
              <textarea
                id="p-desc"
                v-model="form.descripcion"
                rows="3"
                maxlength="500"
                placeholder="¿De qué trata el proyecto?"
                class="textarea textarea-bordered w-full"
              ></textarea>
              <p class="text-xs opacity-50 text-right">{{ form.descripcion.length }}/500</p>
            </div>
          </div>
        </section>

        <!-- 2. Seguimiento -->
        <section>
          <h4 class="text-xs font-semibold uppercase tracking-wide opacity-60 mb-2">Seguimiento</h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium mb-1" for="p-estado">Estado</label>
              <select id="p-estado" v-model="form.estado" class="select select-bordered w-full">
                <option v-for="e in ESTADOS" :key="e.value" :value="e.value">{{ e.label }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1" for="p-prio">Prioridad</label>
              <select id="p-prio" v-model="form.prioridad" class="select select-bordered w-full">
                <option v-for="p in PRIORIDADES" :key="p.value" :value="p.value">{{ p.label }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1" for="p-ini">Fecha de inicio</label>
              <input id="p-ini" v-model="form.fechaInicio" type="date" class="input input-bordered w-full" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1" for="p-fin">Fecha de entrega</label>
              <input id="p-fin" v-model="form.fechaEntrega" type="date" class="input input-bordered w-full" />
            </div>
          </div>
          <p v-if="errores.fechas" class="text-error text-xs mt-1">{{ errores.fechas }}</p>
        </section>

        <!-- 3. Tecnologías -->
        <section>
          <h4 class="text-xs font-semibold uppercase tracking-wide opacity-60 mb-2">Tecnologías</h4>

          <!-- Las ya elegidas -->
          <div v-if="form.tecnologias.length" class="flex flex-wrap gap-2 mb-3">
            <TechBadge v-for="t in form.tecnologias" :key="t" :nombre="t" quitable @quitar="quitarTec(t)" />
          </div>

          <!-- Buscador -->
          <div class="relative">
            <input
              v-model="busqueda"
              type="text"
              maxlength="30"
              autocomplete="off"
              placeholder="Escribe para buscar: vue, laravel, docker..."
              class="input input-bordered w-full"
              @focus="listaAbierta = true"
              @blur="listaAbierta = false"
              @input="listaAbierta = true"
              @keydown="onKeydown"
            />

            <!-- mousedown.prevent: al hacer clic en una opción, el campo no pierde el foco -->
            <div
              v-if="listaAbierta && opciones.length"
              class="absolute z-20 mt-1 w-full bg-base-100 border border-base-300 rounded-box shadow-xl"
              @mousedown.prevent
            >
              <ul ref="listaEl" class="max-h-56 overflow-y-auto py-1">
                <li
                  v-for="(op, i) in opciones"
                  :key="op.nombre + (op.personalizada ? '*' : '')"
                  :data-activo="activo(i)"
                  class="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-base-200"
                  :class="{ 'bg-base-200': activo(i) }"
                  @click="elegir(op)"
                >
                  <TechIcon :nombre="op.personalizada ? '+' : op.nombre" :icono="op.icono" tam="1.4rem" />
                  <span v-if="op.personalizada">Agregar «<b>{{ op.nombre }}</b>»</span>
                  <span v-else>{{ op.nombre }}</span>
                </li>
              </ul>
            </div>
          </div>

          <p v-if="listaAbierta && busqueda.trim() && !opciones.length" class="text-xs opacity-60 mt-1">
            Esa tecnología ya está agregada.
          </p>
          <p v-else class="text-xs opacity-60 mt-1">
            Escribe y elige con clic o Enter. Con las flechas ↑ ↓ te mueves por la lista. Si no existe, puedes agregarla igual.
          </p>
        </section>

        <!-- 4. Repositorio -->
        <section>
          <h4 class="text-xs font-semibold uppercase tracking-wide opacity-60 mb-2">Repositorio</h4>
          <input
            v-model="form.repositorio"
            type="url"
            placeholder="https://github.com/usuario/repositorio"
            class="input input-bordered w-full"
            :class="{ 'input-error': errores.repositorio }"
          />
          <p v-if="errores.repositorio" class="text-error text-xs mt-1">{{ errores.repositorio }}</p>
        </section>
      </div>

      <!-- Acciones -->
      <div class="modal-action">
        <button type="button" class="btn" :disabled="guardando" @click="emit('cerrar')">Cancelar</button>
        <button type="button" class="btn btn-primary" :disabled="guardando" @click="guardar">
          {{ guardando ? 'Guardando...' : proyecto ? 'Guardar cambios' : 'Crear proyecto' }}
        </button>
      </div>
    </div>
  </div>
</template>