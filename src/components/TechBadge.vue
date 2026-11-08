<script setup lang="ts">
import { computed } from 'vue'
import { buscarTecnologia } from '../utils/tecnologias'
import TechIcon from './TechIcon.vue'

const props = defineProps<{ nombre: string; quitable?: boolean; pequeno?: boolean }>()
const emit = defineEmits<{ (e: 'quitar'): void }>()

const icono = computed(() => buscarTecnologia(props.nombre)?.icono ?? null)
</script>

<template>
  <span class="badge badge-outline gap-1.5 whitespace-nowrap" :class="pequeno ? 'badge-sm' : 'badge-lg'">
    <TechIcon :nombre="nombre" :icono="icono" :tam="pequeno ? '0.9rem' : '1.1rem'" />
    {{ nombre }}
    <button
      v-if="quitable"
      type="button"
      class="font-bold opacity-60 hover:opacity-100"
      :aria-label="`Quitar ${nombre}`"
      @click="emit('quitar')"
    >
      ✕
    </button>
  </span>
</template>