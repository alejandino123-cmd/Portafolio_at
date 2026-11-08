<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProyectosStore, ESTADOS } from '../stores/proyectos'
import TechBadge from '../components/TechBadge.vue'

const store = useProyectosStore()

const buscar = ref('')
const estadoFiltro = ref('')

const visibles = computed(() => {
  const q = buscar.value.trim().toLowerCase()
  return store.proyectos.filter(p =>
    (!q || p.nombre.toLowerCase().includes(q)) &&
    (!estadoFiltro.value || p.estado === estadoFiltro.value)
  )
})

const estadoInfo = (valor: string) => ESTADOS.find(e => e.value === valor)

const fecha = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString('es-SV', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' })
    : 'Sin fecha'
</script>

<template>
  <section class="p-4 md:p-6 w-full">
    <h1 class="text-xl md:text-2xl font-bold text-neutral">Mis proyectos</h1>
    <p class="text-sm text-gray-500 mb-4">Tus proyectos en tarjetas, con su avance y tecnologías.</p>

    <div class="flex flex-wrap items-center gap-3 mb-4">
      <input
        v-model="buscar"
        type="search"
        placeholder="Buscar por nombre"
        class="input input-bordered input-sm w-full sm:w-64"
      />
      <select v-model="estadoFiltro" class="select select-bordered select-sm">
        <option value="">Todos los estados</option>
        <option v-for="e in ESTADOS" :key="e.value" :value="e.value">{{ e.label }}</option>
      </select>
    </div>

    <div v-if="store.cargando" class="text-center py-10"><span class="loading loading-spinner"></span></div>

    <p v-else-if="!visibles.length" class="text-center text-gray-500 py-10">
      {{ store.proyectos.length ? 'Ningún proyecto coincide con la búsqueda.' : 'Aún no hay proyectos. Crea el primero desde la tabla general.' }}
    </p>

    <div v-else class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <article
        v-for="p in visibles"
        :key="p.id"
        class="rounded-box bg-base-100 border border-base-300 p-4 flex flex-col gap-3 transition-colors hover:border-secondary"
      >
        <div class="flex items-start justify-between gap-2">
          <RouterLink :to="`/proyectos/${p.id}`" class="font-bold text-primary hover:underline">
            {{ p.nombre }}
          </RouterLink>
          <span class="badge badge-sm shrink-0" :class="estadoInfo(p.estado)?.badge">
            {{ estadoInfo(p.estado)?.label ?? p.estado }}
          </span>
        </div>

        <p class="text-sm opacity-70 line-clamp-2 min-h-[2.5rem]">{{ p.descripcion || 'Sin descripción' }}</p>

        <div class="flex flex-wrap gap-1 min-h-[1.5rem]">
          <TechBadge v-for="t in p.tecnologias?.slice(0, 4)" :key="t" :nombre="t" pequeno />
          <span v-if="(p.tecnologias?.length ?? 0) > 4" class="text-xs opacity-60 self-center">
            +{{ p.tecnologias.length - 4 }}
          </span>
          <span v-if="!p.tecnologias?.length" class="opacity-40 text-sm">Sin tecnologías</span>
        </div>

        <div>
          <div class="flex justify-between text-xs mb-1">
            <span class="opacity-60">{{ p.tareasCompletas }}/{{ p.tareasTotales }} tareas</span>
            <span>{{ store.avance(p) }}%</span>
          </div>
          <progress class="progress progress-secondary w-full" :value="store.avance(p)" max="100"></progress>
        </div>

        <div class="flex items-center justify-between gap-2 mt-auto pt-1">
          <span class="text-xs opacity-70">Entrega: {{ fecha(p.fechaEntrega) }}</span>
          <div class="flex gap-1">
            <RouterLink :to="`/proyectos/${p.id}`" class="btn btn-outline btn-primary btn-xs">Detalle</RouterLink>
            <RouterLink :to="`/proyectos/${p.id}/tareas`" class="btn btn-outline btn-xs">Tareas</RouterLink>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>