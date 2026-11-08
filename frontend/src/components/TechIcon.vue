<script setup lang="ts">
// Muestra el logo de la tecnología (Devicon) o, si no tiene, un círculo con su inicial
withDefaults(defineProps<{ nombre: string; icono?: string | null; tam?: string }>(), {
  icono: null,
  tam: '1.1rem',
})
</script>

<template>
  <i v-if="icono" :class="icono" :style="{ fontSize: tam, lineHeight: 1 }" aria-hidden="true"></i>
  <span
    v-else
    class="inline-flex items-center justify-center rounded-full bg-base-300 font-bold shrink-0"
    :style="{ width: tam, height: tam, fontSize: `calc(${tam} * 0.55)` }"
    aria-hidden="true"
  >
    {{ nombre.charAt(0).toUpperCase() }}
  </span>
</template>