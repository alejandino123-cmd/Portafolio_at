import { createRouter, createWebHistory } from 'vue-router'
import LayoutViews from '../LayoutViews.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: LayoutViews,
      children: [
        { path: '', redirect: '/proyectos' },
        { path: 'proyectos', name: 'proyectos', component: () => import('../views/ProyectosView.vue') },
        { path: 'inicio', component: () => import('../views/InicioView.vue') },
        { path: 'proyectos/:id', component: () => import('../views/DetalleView.vue') },
        { path: 'proyectos/:id/tareas', name: 'tareas', component: () => import('../views/TareasView.vue') },
        { path: 'tareas', component: () => import('../views/TodasTareasView.vue') },
        { path: 'mis-proyectos', component: () => import('../views/MisProyectosView.vue') },
      ],
    },
  ],
})

export default router