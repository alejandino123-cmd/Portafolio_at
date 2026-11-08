<script setup lang="ts">
import { useProyectosStore } from '../stores/proyectos'

const store = useProyectosStore()
defineEmits<{ (e: 'toggle-menu'): void }>()
</script>

<template>
  <header class="top-menu">
    <div class="top-menu__izq">
      <!-- Botón de menú: solo se ve en pantallas pequeñas -->
      <button class="btn btn-ghost btn-square btn-sm lg:hidden text-white" aria-label="Abrir menú" @click="$emit('toggle-menu')">
        ☰
      </button>
      <span class="top-menu__titulo">Gestor de Proyectos</span>
    </div>
    <span class="badge border-0 bg-white text-primary font-semibold">{{ store.total }} Proyectos</span>
  </header>
</template>

<style scoped>
/* Se usa top-menu (y no "menu") para no chocar con la clase menu de DaisyUI */
.top-menu {
  width: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background-color: #1a3d63;
  color: #ffffff;
  font-weight: bold;
  padding: 14px 24px;
}

.top-menu__izq {
  display: flex;
  align-items: center;
  gap: 8px;
}

.top-menu__titulo {
  font-size: clamp(1.1rem, 4vw, 1.5rem);
}

@media (max-width: 640px) {
  .top-menu {
    padding: 12px 16px;
  }
}
</style>