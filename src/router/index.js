import { createRouter, createWebHistory } from 'vue-router'
import beforeEach from "./beforeEach";

// Importar as views
import LoginView from '../views/auth/LoginView.vue'
import RegisterView from '../views/auth/RegisterView.vue'
import TheContainer from '../components/TheContainer.vue'

const routes = [
  // Rotas públicas (sem autenticação)
  {
    path: '/teste',
    name: 'teste',
    component: () => import("../views/TasksView.vue")
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
    meta: { requiresGuest: true }
  },
  
  // Rotas protegidas (dentro do TheContainer)
  {
    path: '/',
    component: TheContainer,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/dashboard'
      },
      {
        path: 'dashboard',
        name: 'dashboard', // Alterado para minúsculo
        component: () => import('../views/DashboardView.vue')
      },
      {
        path: 'tasks',
        name: 'tasks', // Alterado para minúsculo
        component: () => import('../views/TasksView.vue'),
        meta: { title: 'Tarefas' }
      },
      {
        path: 'my-tasks',
        name: 'my-tasks',
        component: () => import('../views/MyTasksView.vue'),
        meta: { title: 'Minhas Tarefas' }
      },
      {
        path: 'categories',
        name: 'categories', // Alterado para minúsculo
        component: () => import('../views/CategoriesView.vue'),
        meta: { title: 'Categorias' }
      },
      {
        path: 'users',
        name: 'Users',
        component: () => import('../views/UsersView.vue'),
        meta: { title: 'Usuários' }
      },
      {
        path: 'reports',
        name: 'Reports',
        component: () => import('../views/ReportsView.vue'),
        meta: { title: 'Relatórios' }
      },
      {
        path: 'reports-dashboard',
        name: 'ReportsDashboard',
        component: () => import('../views/ReportsDashboard.vue'),
        meta: { title: 'Dashboard de Relatórios' }
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('../views/ProfileView.vue'),
        meta: { title: 'Perfil' }
      }
    ]
  },
  
  // Rota de fallback
  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guard de navegação global
router.beforeEach(beforeEach);

export default router
