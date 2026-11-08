<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  abierto: boolean
  mensaje: string
  titulo?: string
  cargando?: boolean
}>()

const emit = defineEmits<{
  (e: 'confirmar'): void
  (e: 'cancelar'): void
}>()

// Esc cierra la ventana
function alPresionar(ev: KeyboardEvent) {
  if (props.abierto && ev.key === 'Escape') emit('cancelar')
}
onMounted(() => window.addEventListener('keydown', alPresionar))
onUnmounted(() => window.removeEventListener('keydown', alPresionar))
</script>

<template>
  <div
    class="modal"
    :class="{ 'modal-open': abierto }"
    role="dialog"
    aria-modal="true"
    @click.self="emit('cancelar')"
  >
    <div class="modal-box">
      <h3 class="font-bold text-lg text-neutral">{{ titulo ?? '¿Estás seguro?' }}</h3>
      <p class="py-3">{{ mensaje }}</p>
      <p class="text-xs opacity-60">Esta acción no se puede deshacer.</p>
      <div class="modal-action">
        <button class="btn btn-ghost" :disabled="cargando" @click="emit('cancelar')">Cancelar</button>
        <button class="btn btn-error" :disabled="cargando" @click="emit('confirmar')">Sí, eliminar</button>
      </div>
    </div>
  </div>
</template>