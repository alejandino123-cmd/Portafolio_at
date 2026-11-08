<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProyectosStore } from '../stores/proyectos'

const store = useProyectosStore()

type Filtro = 'todas' | 'pendientes' | 'completadas'
const filtro = ref<Filtro>('todas')
const proyectoId = ref('')

// Junta las tareas de todos los proyectos en una sola lista
const todas = computed(() =>
  store.proyectos.flatMap(p =>
    (p.tareas ?? []).map(t => ({ ...t, proyectoId: p.id, proyecto: p.nombre }))
  )
)

const visibles = computed(() =>
  todas.value.filter(t => {
    if (proyectoId.value && t.proyectoId !== proyectoId.value) return false
    if (filtro.value === 'pendientes') return !t.completada
    if (filtro.value === 'completadas') return t.completada
    return true
  })
)

const pendientes = computed(() => todas.value.filter(t => !t.completada).length)
</script>

<template>
  <section class="p-4 md:p-6 w-full">
    <h1 class="text-xl md:text-2xl font-bold text-neutral">Todas las tareas</h1>
    <p class="text-sm text-gray-500 mb-4">
      {{ todas.length }} tareas en total, {{ pendientes }} pendientes. Para marcarlas o eliminarlas, entra a la pantalla de tareas del proyecto.
    </p>

    <div class="flex flex-wrap items-center gap-3 mb-4">
      <div class="join">
        <button class="join-item btn btn-sm" :class="{ 'btn-primary': filtro === 'todas' }" @click="filtro = 'todas'">Todas</button>
        <button class="join-item btn btn-sm" :class="{ 'btn-primary': filtro === 'pendientes' }" @click="filtro = 'pendientes'">Pendientes</button>
        <button class="join-item btn btn-sm" :class="{ 'btn-primary': filtro === 'completadas' }" @click="filtro = 'completadas'">Completadas</button>
      </div>

      <select v-model="proyectoId" class="select select-bordered select-sm">
        <option value="">Todos los proyectos</option>
        <option v-for="p in store.proyectos" :key="p.id" :value="p.id">{{ p.nombre }}</option>
      </select>
    </div>

    <div v-if="store.cargando" class="text-center py-10"><span class="loading loading-spinner"></span></div>

    <div v-else class="overflow-x-auto rounded-box bg-base-100 border border-base-300">
      <table class="table">
        <thead>
          <tr>
            <th>Tarea</th>
            <th>Proyecto</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!visibles.length">
            <td colspan="3" class="text-center text-gray-500">No hay tareas con este filtro.</td>
          </tr>
          <tr v-for="t in visibles" :key="t.id" class="hover:bg-base-200">
            <td :class="{ 'line-through opacity-60': t.completada }">{{ t.titulo }}</td>
            <td>
              <RouterLink :to="`/proyectos/${t.proyectoId}/tareas`" class="link link-primary">{{ t.proyecto }}</RouterLink>
            </td>
            <td>
              <span class="badge badge-sm" :class="t.completada ? 'badge-success' : 'badge-warning'">
                {{ t.completada ? 'Completada' : 'Pendiente' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>