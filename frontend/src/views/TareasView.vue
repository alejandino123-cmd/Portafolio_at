<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useProyectosStore, type Tarea } from '../stores/proyectos'
import ConfirmarEliminar from '../components/ConfirmarEliminar.vue'

const route = useRoute()
const store = useProyectosStore()

const proyecto = computed(() => store.proyectos.find(p => p.id === route.params.id))

const nuevaTarea = ref('')
const error = ref('')
const guardando = ref(false)

async function agregar() {
  const titulo = nuevaTarea.value.trim()
  if (!titulo || !proyecto.value) return
  guardando.value = true
  error.value = ''
  try {
    await store.agregarTarea(proyecto.value.id, titulo)
    nuevaTarea.value = ''
  } catch (e) {
    error.value = (e as Error).message
  } finally {
    guardando.value = false
  }
}

async function alternar(tareaId: string, evento: Event) {
  if (!proyecto.value) return
  error.value = ''
  const casilla = evento.target as HTMLInputElement
  try {
    await store.toggleTarea(proyecto.value.id, tareaId)
  } catch (e) {
    error.value = (e as Error).message
    // Si falló, la casilla vuelve a su estado real
    casilla.checked = !casilla.checked
  }
}

// Eliminar con confirmación
const tareaPorEliminar = ref<Tarea | null>(null)
const eliminando = ref(false)

async function confirmarQuitar() {
  if (!proyecto.value || !tareaPorEliminar.value) return
  eliminando.value = true
  error.value = ''
  try {
    await store.eliminarTarea(proyecto.value.id, tareaPorEliminar.value.id)
  } catch (e) {
    error.value = (e as Error).message
  } finally {
    eliminando.value = false
    tareaPorEliminar.value = null
  }
}
</script>

<template>
  <section class="p-4 md:p-6 w-full max-w-3xl">
    <div v-if="store.cargando" class="text-center py-10"><span class="loading loading-spinner"></span></div>

    <div v-else-if="!proyecto" class="text-center py-10">
      <p class="mb-3 text-gray-500">No se encontró este proyecto. Puede que ya se haya eliminado.</p>
      <RouterLink to="/proyectos" class="btn btn-primary btn-sm">Volver al listado</RouterLink>
    </div>

    <template v-else>
      <!-- Ruta de navegación -->
      <div class="breadcrumbs text-sm">
        <ul>
          <li><RouterLink to="/proyectos">Proyectos</RouterLink></li>
          <li>{{ proyecto.nombre }}</li>
        </ul>
      </div>

      <div class="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <h1 class="text-xl md:text-2xl font-bold text-neutral">{{ proyecto.nombre }}</h1>
          <p class="text-sm text-gray-500">
            Agrega tareas y márcalas como completadas para actualizar el avance del proyecto.
          </p>
        </div>
        <RouterLink :to="`/proyectos/${proyecto.id}`" class="btn btn-outline btn-primary btn-sm">Ver detalle</RouterLink>
      </div>

      <div class="flex items-center gap-2 mb-1">
        <progress class="progress progress-secondary w-full" :value="store.avance(proyecto)" max="100"></progress>
        <span class="text-sm w-10 text-right">{{ store.avance(proyecto) }}%</span>
      </div>
      <p class="text-xs opacity-60 mb-5">
        {{ proyecto.tareasCompletas }} de {{ proyecto.tareasTotales }} completadas
      </p>

      <div v-if="error" class="alert alert-error mb-4 text-sm">{{ error }}</div>

      <div class="flex gap-2 mb-4">
        <input
          v-model="nuevaTarea"
          type="text"
          maxlength="200"
          placeholder="Escribe una nueva tarea y presiona Enter..."
          class="input input-bordered w-full"
          @keyup.enter="agregar"
        />
        <button class="btn btn-secondary" :disabled="guardando || !nuevaTarea.trim()" @click="agregar">
          Agregar tarea
        </button>
      </div>

      <div class="rounded-box bg-base-100 border border-base-300">
        <p v-if="!proyecto.tareas?.length" class="p-4 text-sm text-gray-500 text-center">
          Este proyecto aún no tiene tareas. Agrega la primera arriba.
        </p>
        <ul v-else class="divide-y divide-base-300">
          <li v-for="t in proyecto.tareas" :key="t.id" class="flex items-center gap-3 px-4 py-3">
            <input
              type="checkbox"
              class="checkbox checkbox-secondary"
              :checked="t.completada"
              @change="alternar(t.id, $event)"
            />
            <span class="flex-1" :class="{ 'line-through opacity-60': t.completada }">{{ t.titulo }}</span>
            <button class="btn btn-outline btn-error btn-xs" @click="tareaPorEliminar = t">ELIMINAR</button>
          </li>
        </ul>
      </div>
    </template>

    <ConfirmarEliminar
      :abierto="!!tareaPorEliminar"
      :cargando="eliminando"
      :mensaje="`¿Seguro que quieres eliminar la tarea &quot;${tareaPorEliminar?.titulo ?? ''}&quot;?`"
      @confirmar="confirmarQuitar"
      @cancelar="tareaPorEliminar = null"
    />
  </section>
</template>