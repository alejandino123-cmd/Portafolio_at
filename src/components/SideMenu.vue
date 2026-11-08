<script setup lang="ts">
import { useProyectosStore } from '../stores/proyectos'

defineProps<{ abierto?: boolean }>()
const store = useProyectosStore()

const enlaces = [
  { to: '/inicio', icono: '⌂', texto: 'Inicio' },
  { to: '/proyectos', icono: '▦', texto: 'Ver tabla general' },
  { to: '/mis-proyectos', icono: '❖', texto: 'Mis proyectos' },
  { to: '/tareas', icono: '✓', texto: 'Todas las tareas' },
]
</script>

<template>
  <!-- En pantallas grandes es fijo; en pequeñas aparece encima al abrirlo desde la barra superior -->
  <aside
    class="bg-neutral text-neutral-content w-64 shrink-0 p-4 overflow-y-auto fixed inset-y-0 left-0 z-40 transition-transform duration-200 lg:static lg:z-auto lg:translate-x-0 lg:min-h-full"
    :class="abierto ? 'translate-x-0' : '-translate-x-full'"
  >
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-bold text-white">Menú</h2>
      <span class="badge badge-sm border-0 bg-accent text-accent-content" :title="`${store.total} proyectos`">
        {{ store.total }}
      </span>
    </div>

    <nav class="flex flex-col gap-1">
      <RouterLink
        v-for="e in enlaces"
        :key="e.to"
        :to="e.to"
        class="btn btn-ghost btn-block justify-start gap-3 border-0 font-medium normal-case text-accent hover:bg-white/10 hover:text-white"
        active-class="!bg-secondary !text-white font-semibold shadow"
      >
        <span class="w-4 text-center">{{ e.icono }}</span>
        {{ e.texto }}
      </RouterLink>
    </nav>
  </aside>
</template>