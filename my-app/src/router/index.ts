import { createRouter, createWebHistory } from 'vue-router'
import Login from '../components/Login.vue'
import Register from '../components/Register.vue'
import Home from '../views/Home.vue'
import Marketplace from '../views/Marketplace.vue'
import Profile from '../views/Profile.vue'
import Sell from '../views/Sell.vue'

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
      component: Register
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      meta: { requiresAuth: true }, // This route requires authentication
    },
    {
      path: '/marketplace',
      name: 'marketplace',
      component: Marketplace,
      meta: { requiresAuth: true }, // This route requires authentication
    },
    {
      path: '/thrift-stores',
      name: 'thrift-stores',
      component: Marketplace,
      meta: { requiresAuth: true }, // This route requires authentication
    },
    {
      path: '/thrift-events',
      name: 'thrift-events',
      component: Marketplace,
      meta: { requiresAuth: true }, // This route requires authentication
    },
    {
      path: '/fashion-blog',
      name: 'fashion-blog',
      component: Marketplace,
      meta: { requiresAuth: true }, // This route requires authentication
    },
    {
      path: '/chat',
      name: 'chat',
      component: Marketplace,
      meta: { requiresAuth: true }, // This route requires authentication
    },
    {
      path: '/cart',
      name: 'cart',
      component: Marketplace,
      meta: { requiresAuth: true }, // This route requires authentication
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
      meta: { requiresAuth: true }, // This route requires authentication
    },
    {
      path: '/sell',
      name: 'sell',
      component: Sell,
      meta: { requiresAuth: true }, // This route requires authentication
    },
  ]
})

export default router

