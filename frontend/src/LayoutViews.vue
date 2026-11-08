<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import SideMenu from './components/SideMenu.vue'
import TopMenu from './components/TopMenu.vue'
import { useProyectosStore } from './stores/proyectos'

const store = useProyectosStore()
const route = useRoute()

const menuAbierto = ref(false)

// Al cambiar de pantalla se cierra el menú (útil en celular)
watch(() => route.fullPath, () => {
  menuAbierto.value = false
})

onMounted(() => store.cargar()) // carga los proyectos desde MongoDB
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <TopMenu @toggle-menu="menuAbierto = !menuAbierto" />
    <main class="flex flex-row flex-1 relative">
      <!-- Fondo oscuro detrás del menú en pantallas pequeñas -->
      <div v-if="menuAbierto" class="fixed inset-0 bg-black/40 z-30 lg:hidden" @click="menuAbierto = false"></div>

      <SideMenu :abierto="menuAbierto" />

      <div class="flex-1 min-w-0 bg-base-100">
        <RouterView />
      </div>
    </main>
  </div>
</template>