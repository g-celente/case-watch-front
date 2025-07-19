import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth/auth.js'

// Importar as views
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import DashboardView from '../views/DashboardView.vue'

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView,
    meta: { requiresGuest: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guard de navegação
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // Verificar se a rota requer autenticação
  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      next('/login')
      return
    }
  }
  
  // Verificar se a rota é apenas para convidados (não autenticados)
  if (to.meta.requiresGuest) {
    if (authStore.isAuthenticated) {
      next('/dashboard')
      return
    }
  }
  
  next()
})

export default router
