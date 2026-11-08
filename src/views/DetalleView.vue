<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useProyectosStore, ESTADOS } from '../stores/proyectos'
import TechBadge from '../components/TechBadge.vue'

const route = useRoute()
const store = useProyectosStore()

const proyecto = computed(() => store.proyectos.find(p => p.id === route.params.id))
const estado = computed(() => ESTADOS.find(e => e.value === proyecto.value?.estado))

const fecha = (iso: string | null | undefined) =>
  iso
    ? new Date(iso).toLocaleDateString('es-SV', { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'UTC' })
    : 'Sin fecha'
</script>

<template>
  <section class="p-4 md:p-6 w-full">
    <div v-if="store.cargando" class="text-center py-10"><span class="loading loading-spinner"></span></div>

    <div v-else-if="!proyecto" class="text-center py-10">
      <p class="mb-3 text-gray-500">No se encontró este proyecto. Puede que ya se haya eliminado.</p>
      <RouterLink to="/proyectos" class="btn btn-primary btn-sm">Volver al listado</RouterLink>
    </div>

    <template v-else>
      <RouterLink to="/proyectos" class="link link-primary text-sm">← Volver al listado</RouterLink>

      <div class="flex flex-wrap items-start justify-between gap-3 mt-2 mb-4">
        <div>
          <h1 class="text-xl md:text-2xl font-bold text-neutral">{{ proyecto.nombre }}</h1>
          <p class="text-sm text-gray-500">{{ proyecto.descripcion || 'Sin descripción' }}</p>
        </div>
        <RouterLink :to="`/proyectos/${proyecto.id}/tareas`" class="btn btn-primary btn-sm">
          Gestionar tareas
        </RouterLink>
      </div>

      <div class="grid gap-6 lg:grid-cols-3">
        <div class="rounded-box bg-base-100 border border-base-300 p-4 lg:col-span-1 space-y-3">
          <h2 class="font-bold">Información</h2>
          <div class="text-sm space-y-2">
            <div class="flex justify-between gap-3">
              <span class="opacity-60">Estado</span>
              <span class="badge badge-sm" :class="estado?.badge">{{ estado?.label ?? proyecto.estado }}</span>
            </div>
            <div class="flex justify-between gap-3">
              <span class="opacity-60">Prioridad</span><span>{{ proyecto.prioridad }}</span>
            </div>
            <div class="flex justify-between gap-3">
              <span class="opacity-60">Inicio</span><span>{{ fecha(proyecto.fechaInicio) }}</span>
            </div>
            <div class="flex justify-between gap-3">
              <span class="opacity-60">Entrega</span><span>{{ fecha(proyecto.fechaEntrega) }}</span>
            </div>
            <div class="flex justify-between gap-3">
              <span class="opacity-60">Repositorio</span>
              <a v-if="proyecto.repositorio" :href="proyecto.repositorio" target="_blank" rel="noopener" class="link link-primary">
                ↗ Abrir
              </a>
              <span v-else>—</span>
            </div>
          </div>

          <div>
            <div class="flex justify-between text-sm mb-1">
              <span class="opacity-60">Avance</span><span>{{ store.avance(proyecto) }}%</span>
            </div>
            <progress class="progress progress-secondary w-full" :value="store.avance(proyecto)" max="100"></progress>
          </div>

          <div>
            <div class="text-sm opacity-60 mb-1">Tecnologías</div>
            <div class="flex flex-wrap gap-1">
              <TechBadge v-for="t in proyecto.tecnologias" :key="t" :nombre="t" pequeno />
              <span v-if="!proyecto.tecnologias?.length" class="opacity-40">—</span>
            </div>
          </div>
        </div>

        <div class="rounded-box bg-base-100 border border-base-300 p-4 lg:col-span-2">
          <div class="flex items-center justify-between mb-3">
            <h2 class="font-bold">Tareas</h2>
            <span class="badge badge-neutral">{{ proyecto.tareasCompletas }}/{{ proyecto.tareasTotales }}</span>
          </div>

          <p v-if="!proyecto.tareas?.length" class="text-sm text-gray-500">
            Este proyecto aún no tiene tareas. Agrégalas en “Gestionar tareas”.
          </p>
          <ul v-else class="divide-y divide-base-200">
            <li v-for="t in proyecto.tareas" :key="t.id" class="py-2 flex items-center gap-3">
              <span :class="t.completada ? 'text-success' : 'opacity-40'">{{ t.completada ? '✔' : '○' }}</span>
              <span :class="{ 'line-through opacity-60': t.completada }">{{ t.titulo }}</span>
            </li>
          </ul>
        </div>
      </div>
    </template>
  </section>
</template>