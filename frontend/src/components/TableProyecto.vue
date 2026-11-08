<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useProyectosStore, ESTADOS, type Proyecto } from '../stores/proyectos'
import ProyectoForm from './ProyectoForm.vue'
import TechBadge from './TechBadge.vue'
import ConfirmarEliminar from './ConfirmarEliminar.vue'

const store = useProyectosStore()

const formAbierto = ref(false)
const editando = ref<Proyecto | null>(null)

function nuevo() {
  editando.value = null
  formAbierto.value = true
}

function editar(p: Proyecto) {
  editando.value = p
  formAbierto.value = true
}

// Eliminar con confirmación
const porEliminar = ref<Proyecto | null>(null)
const eliminando = ref(false)

function pedirEliminar(p: Proyecto) {
  porEliminar.value = p
}

async function confirmarEliminar() {
  if (!porEliminar.value) return
  eliminando.value = true
  try {
    await store.eliminar(porEliminar.value.id)
  } catch (e) {
    store.error = (e as Error).message
  } finally {
    eliminando.value = false
    porEliminar.value = null
  }
}

const estadoInfo = (valor: string) => ESTADOS.find(e => e.value === valor)

// Las fechas se guardan a medianoche UTC; se muestran en UTC para que no se corran un día
const fecha = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString('es-SV', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' })
    : 'Sin fecha'

// Entrega vencida: la fecha ya pasó y el proyecto no está finalizado
const vencida = (p: Proyecto) =>
  !!p.fechaEntrega && p.estado !== 'finalizado' && new Date(p.fechaEntrega).getTime() < Date.now()

// ---------- Paginado: 5 proyectos por página ----------
const porPagina = 5
const pagina = ref(1)

const totalPaginas = computed(() => Math.max(1, Math.ceil(store.proyectos.length / porPagina)))

const proyectosPagina = computed(() => {
  const inicio = (pagina.value - 1) * porPagina
  return store.proyectos.slice(inicio, inicio + porPagina)
})

const desde = computed(() => (store.proyectos.length ? (pagina.value - 1) * porPagina + 1 : 0))
const hasta = computed(() => (pagina.value - 1) * porPagina + proyectosPagina.value.length)

// Si se elimina el último proyecto de una página, vuelve a la anterior
watch(totalPaginas, (n) => {
  if (pagina.value > n) pagina.value = n
})
</script>

<template>
  <section class="p-4 md:p-6 w-full">
    <div class="flex flex-wrap items-start justify-between gap-3 mb-4">
      <div>
        <h1 class="text-xl md:text-2xl font-bold text-neutral">Listado de Proyectos</h1>
        <p class="text-sm text-gray-500">Administra tus proyectos y revisa el progreso de sus tareas.</p>
      </div>
      <button class="btn btn-secondary" @click="nuevo">+ NUEVO PROYECTO</button>
    </div>

    <div v-if="store.error" class="alert alert-error mb-4">{{ store.error }}</div>

    <div class="overflow-x-auto rounded-box bg-base-100 border border-base-300">
      <table class="table">
        <thead class="bg-base-200 text-secondary">
          <tr>
            <th>#</th>
            <th>Proyecto</th>
            <th class="hidden lg:table-cell">Tecnologías</th>
            <th>Estado</th>
            <th class="hidden md:table-cell">Entrega</th>
            <th class="hidden md:table-cell">Tareas</th>
            <th class="hidden sm:table-cell w-56">Avance</th>
            <th class="w-px whitespace-nowrap text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="store.cargando">
            <td colspan="8" class="text-center"><span class="loading loading-spinner"></span></td>
          </tr>
          <tr v-else-if="!store.proyectos.length">
            <td colspan="8" class="text-center text-gray-500">Aún no hay proyectos. Crea el primero.</td>
          </tr>

          <tr v-for="(p, i) in proyectosPagina" :key="p.id" class="hover:bg-base-200">
            <th>{{ (pagina - 1) * porPagina + i + 1 }}</th>

            <td class="max-w-[12rem] sm:max-w-xs">
              <RouterLink :to="`/proyectos/${p.id}`" class="font-semibold text-neutral hover:underline">
                {{ p.nombre }}
              </RouterLink>
              <div v-if="p.descripcion" class="text-xs opacity-60 truncate">{{ p.descripcion }}</div>
              <a
                v-if="p.repositorio"
                :href="p.repositorio"
                target="_blank"
                rel="noopener"
                class="link link-primary text-xs"
              >
                ↗ Repositorio
              </a>
              <!-- En pantallas muy pequeñas el avance va debajo del nombre -->
              <div class="sm:hidden text-xs opacity-70 mt-1">
                Avance {{ store.avance(p) }}% · {{ p.tareasCompletas }}/{{ p.tareasTotales }} tareas
              </div>
            </td>

            <td class="hidden lg:table-cell">
              <div class="flex flex-wrap gap-1 max-w-[18rem]">
                <TechBadge v-for="t in p.tecnologias" :key="t" :nombre="t" pequeno />
                <span v-if="!p.tecnologias?.length" class="opacity-40">—</span>
              </div>
            </td>

            <td>
              <span class="badge badge-sm" :class="estadoInfo(p.estado)?.badge">
                {{ estadoInfo(p.estado)?.label ?? p.estado }}
              </span>
              <div class="text-xs opacity-60 mt-1">Prioridad {{ p.prioridad }}</div>
            </td>

            <td class="hidden md:table-cell whitespace-nowrap text-sm" :class="{ 'text-error font-semibold': vencida(p) }">
              {{ fecha(p.fechaEntrega) }}
              <div v-if="vencida(p)" class="text-xs">Vencido</div>
            </td>

            <td class="hidden md:table-cell">
              <span class="badge badge-neutral">{{ p.tareasCompletas }}/{{ p.tareasTotales }}</span>
            </td>

            <td class="hidden sm:table-cell w-56">
              <div class="flex items-center gap-2">
                <progress
                  class="progress progress-secondary w-full"
                  :value="store.avance(p)"
                  max="100"
                ></progress>
                <span class="text-sm w-10 text-right">{{ store.avance(p) }}%</span>
              </div>
            </td>

            <td class="w-px whitespace-nowrap text-right">
              <div class="flex flex-col sm:flex-row justify-end gap-1">
                <RouterLink :to="`/proyectos/${p.id}/tareas`" class="btn btn-primary btn-xs">
                  VER TAREAS
                </RouterLink>
                <button class="btn btn-neutral btn-xs" @click="editar(p)">EDITAR</button>
                <button class="btn btn-outline btn-error btn-xs" @click="pedirEliminar(p)">ELIMINAR</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Paginado -->
    <div v-if="store.proyectos.length" class="flex flex-wrap items-center justify-between gap-3 mt-4">
      <span class="text-sm opacity-70">
        Mostrando {{ desde }}–{{ hasta }} de {{ store.proyectos.length }} proyectos
      </span>

      <div v-if="totalPaginas > 1" class="join">
        <button class="join-item btn btn-sm" :disabled="pagina === 1" @click="pagina--">«</button>
        <button
          v-for="n in totalPaginas"
          :key="n"
          class="join-item btn btn-sm"
          :class="{ 'btn-primary': n === pagina }"
          @click="pagina = n"
        >
          {{ n }}
        </button>
        <button class="join-item btn btn-sm" :disabled="pagina === totalPaginas" @click="pagina++">»</button>
      </div>
    </div>

    <ProyectoForm :abierto="formAbierto" :proyecto="editando" @cerrar="formAbierto = false" />

    <ConfirmarEliminar
      :abierto="!!porEliminar"
      :cargando="eliminando"
      :mensaje="`¿Seguro que quieres eliminar el proyecto &quot;${porEliminar?.nombre ?? ''}&quot;? Se borrarán también sus tareas.`"
      @confirmar="confirmarEliminar"
      @cancelar="porEliminar = null"
    />
  </section>
</template>