import { createRouter, createWebHistory } from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../views/Homepage.vue'
import Marketplace from '../components/Marketplace.vue'
import { app } from '../lib/firebaseConfig'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../components/Register.vue')
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      meta: { requiresAuth: true }, // This route requires authentication
    },
    {
      path: '/marketplace',
      name: 'home',
      component: Marketplace,
      meta: { requiresAuth: true }, // This route requires authentication
    }
  ]
})

export default router

