<script setup lang="ts">
import { computed } from 'vue'
import { useProyectosStore, ESTADOS } from '../stores/proyectos'

const store = useProyectosStore()

const enDesarrollo = computed(() => store.proyectos.filter(p => p.estado === 'desarrollo').length)
const finalizados = computed(() => store.proyectos.filter(p => p.estado === 'finalizado').length)
const tareasPendientes = computed(() =>
  store.proyectos.reduce((suma, p) => suma + (p.tareasTotales - p.tareasCompletas), 0)
)

// Avance general: tareas completadas sobre todas las tareas de todos los proyectos
const avanceGeneral = computed(() => {
  const total = store.proyectos.reduce((s, p) => s + p.tareasTotales, 0)
  const hechas = store.proyectos.reduce((s, p) => s + p.tareasCompletas, 0)
  return total ? Math.round((hechas / total) * 100) : 0
})

const porEstado = computed(() =>
  ESTADOS.map(e => ({
    ...e,
    cantidad: store.proyectos.filter(p => p.estado === e.value).length,
  }))
)

// Las 5 entregas más cercanas entre los proyectos que no están finalizados
const proximasEntregas = computed(() =>
  store.proyectos
    .filter(p => p.fechaEntrega && p.estado !== 'finalizado')
    .sort((a, b) => new Date(a.fechaEntrega!).getTime() - new Date(b.fechaEntrega!).getTime())
    .slice(0, 5)
)

const fecha = (iso: string) =>
  new Date(iso).toLocaleDateString('es-SV', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' })

const vencida = (iso: string) => new Date(iso).getTime() < Date.now()
</script>

<template>
  <section class="p-4 md:p-6 w-full">
    <h1 class="text-xl md:text-2xl font-bold text-neutral">Inicio</h1>
    <p class="text-sm text-gray-500 mb-4">Un resumen rápido de todos tus proyectos.</p>

    <div v-if="store.cargando" class="text-center py-10"><span class="loading loading-spinner"></span></div>

    <template v-else>
      <div class="stats stats-vertical sm:stats-horizontal border border-base-300 w-full mb-6 bg-base-100">
        <div class="stat">
          <div class="stat-title">Proyectos</div>
          <div class="stat-value text-primary">{{ store.total }}</div>
          <div class="stat-desc">registrados en total</div>
        </div>
        <div class="stat">
          <div class="stat-title">En desarrollo</div>
          <div class="stat-value">{{ enDesarrollo }}</div>
          <div class="stat-desc">{{ finalizados }} finalizados</div>
        </div>
        <div class="stat">
          <div class="stat-title">Tareas pendientes</div>
          <div class="stat-value">{{ tareasPendientes }}</div>
          <div class="stat-desc">entre todos los proyectos</div>
        </div>
        <div class="stat">
          <div class="stat-title">Avance general</div>
          <div class="stat-value">{{ avanceGeneral }}%</div>
          <div class="stat-desc">
            <progress class="progress progress-secondary w-full" :value="avanceGeneral" max="100"></progress>
          </div>
        </div>
      </div>

      <div class="grid gap-6 lg:grid-cols-2">
        <div class="rounded-box bg-base-100 border border-base-300 p-4">
          <h2 class="font-bold mb-3">Proyectos por estado</h2>
          <ul class="space-y-3">
            <li v-for="e in porEstado" :key="e.value">
              <div class="flex justify-between text-sm mb-1">
                <span class="badge badge-sm" :class="e.badge">{{ e.label }}</span>
                <span>{{ e.cantidad }}</span>
              </div>
              <progress
                class="progress progress-secondary w-full"
                :value="e.cantidad"
                :max="store.total || 1"
              ></progress>
            </li>
          </ul>
        </div>

        <div class="rounded-box bg-base-100 border border-base-300 p-4">
          <h2 class="font-bold mb-3">Próximas entregas</h2>
          <p v-if="!proximasEntregas.length" class="text-sm text-gray-500">
            No hay entregas pendientes con fecha. Agrega una fecha de entrega al editar un proyecto.
          </p>
          <ul v-else class="divide-y divide-base-200">
            <li v-for="p in proximasEntregas" :key="p.id" class="py-2 flex items-center justify-between gap-3">
              <RouterLink :to="`/proyectos/${p.id}`" class="text-primary font-semibold hover:underline truncate">
                {{ p.nombre }}
              </RouterLink>
              <span
                class="text-sm whitespace-nowrap"
                :class="{ 'text-error font-semibold': vencida(p.fechaEntrega!) }"
              >
                {{ fecha(p.fechaEntrega!) }}<span v-if="vencida(p.fechaEntrega!)"> · Vencido</span>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </template>
  </section>
</template>