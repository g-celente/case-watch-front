<template>
  <div class="min-h-screen bg-white">
    <!-- Dashboard Header -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="py-6">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p class="mt-1 text-sm text-gray-500">
                Bem-vindo de volta, {{ authStore.user?.name || 'Usuário' }}!
              </p>
            </div>
            <div class="flex items-center space-x-3">
              <button
                @click="loadDashboardData"
                :disabled="loading"
                class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                <RefreshCw class="h-4 w-4 mr-2" :class="{ 'animate-spin': loading }" />
                Atualizar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Dashboard Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <span class="ml-2 text-gray-600">Carregando dados...</span>
      </div>

      <!-- Dashboard Content -->
      <div v-else class="space-y-8">
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Total Tasks -->
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="h-8 w-8 rounded-md bg-blue-100 flex items-center justify-center">
                  <FolderOpen class="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-500">Total de Tarefas</p>
                <p class="text-2xl font-semibold text-gray-900">{{ dashboardStats.totalTasks }}</p>
              </div>
            </div>
          </div>

          <!-- Completed Tasks -->
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="h-8 w-8 rounded-md bg-green-100 flex items-center justify-center">
                  <CheckCircle class="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-500">Concluídas</p>
                <p class="text-2xl font-semibold text-gray-900">{{ dashboardStats.completedTasks }}</p>
              </div>
            </div>
          </div>

          <!-- In Progress Tasks -->
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="h-8 w-8 rounded-md bg-yellow-100 flex items-center justify-center">
                  <Clock class="h-5 w-5 text-yellow-600" />
                </div>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-500">Em Progresso</p>
                <p class="text-2xl font-semibold text-gray-900">{{ dashboardStats.inProgressTasks }}</p>
              </div>
            </div>
          </div>

          <!-- Pending Tasks -->
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="h-8 w-8 rounded-md bg-red-100 flex items-center justify-center">
                  <AlertCircle class="h-5 w-5 text-red-600" />
                </div>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-500">Pendentes</p>
                <p class="text-2xl font-semibold text-gray-900">{{ dashboardStats.pendingTasks }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Tasks and Quick Actions -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Recent Tasks -->
          <div class="lg:col-span-2">
            <div class="bg-white rounded-lg border border-gray-200 p-6">
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-lg font-medium text-gray-900">Tarefas Recentes</h2>
                <router-link 
                  to="/my-tasks" 
                  class="text-sm text-purple-600 hover:text-purple-500"
                >
                  Ver todas
                </router-link>
              </div>

              <div v-if="recentTasks.length === 0" class="text-center py-8">
                <FolderOpen class="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p class="text-gray-500">Nenhuma tarefa encontrada</p>
              </div>

              <div v-else class="space-y-4">
                <div
                  v-for="task in recentTasks.slice(0, 5)"
                  :key="task.id"
                  class="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors"
                >
                  <div class="flex-1 min-w-0">
                    <h3 class="text-sm font-medium text-gray-900 truncate">{{ task.title }}</h3>
                    <p class="text-xs text-gray-500 mt-1">{{ task.category?.name || 'Sem categoria' }}</p>
                  </div>
                  <div class="flex items-center space-x-2 ml-4">
                    <span 
                      class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                      :class="getStatusClass(task.status)"
                    >
                      {{ getStatusLabel(task.status) }}
                    </span>
                    <span 
                      class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                      :class="getPriorityClass(task.priority)"
                    >
                      {{ getPriorityLabel(task.priority) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-lg border border-gray-200 p-6">
              <h2 class="text-lg font-medium text-gray-900 mb-6">Ações Rápidas</h2>
              
              <div class="space-y-4">
                <router-link
                  to="/my-tasks"
                  class="block w-full bg-purple-600 text-white rounded-lg px-4 py-3 text-sm font-medium hover:bg-purple-700 transition-colors text-center"
                >
                  <Plus class="h-4 w-4 inline mr-2" />
                  Nova Tarefa
                </router-link>

                <router-link
                  to="/my-tasks"
                  class="block w-full bg-gray-100 text-gray-700 rounded-lg px-4 py-3 text-sm font-medium hover:bg-gray-200 transition-colors text-center"
                >
                  <FolderOpen class="h-4 w-4 inline mr-2" />
                  Minhas Tarefas
                </router-link>

                <router-link
                  to="/categories"
                  class="block w-full bg-gray-100 text-gray-700 rounded-lg px-4 py-3 text-sm font-medium hover:bg-gray-200 transition-colors text-center"
                >
                  <Tag class="h-4 w-4 inline mr-2" />
                  Categorias
                </router-link>

                <router-link
                  to="/reports"
                  class="block w-full bg-gray-100 text-gray-700 rounded-lg px-4 py-3 text-sm font-medium hover:bg-gray-200 transition-colors text-center"
                >
                  <BarChart3 class="h-4 w-4 inline mr-2" />
                  Relatórios
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { 
  FolderOpen, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Plus, 
  Tag, 
  BarChart3,
  RefreshCw
} from 'lucide-vue-next'
import { useAuthStore } from '../stores/auth/auth.js'
import { useTasksStore } from '../stores/tasks.js'
import { useReportsStore } from '../stores/reports.js'

// Stores
const authStore = useAuthStore()
const tasksStore = useTasksStore()
const reportsStore = useReportsStore()

// State
const loading = ref(false)

// Computed
const dashboardStats = computed(() => {
  const overview = reportsStore.overview || {}
  return {
    totalTasks: overview.totalTasks || 0,
    completedTasks: overview.completedTasks || 0,
    inProgressTasks: overview.inProgressTasks || 0,
    pendingTasks: overview.pendingTasks || 0
  }
})

const recentTasks = computed(() => {
  return tasksStore.myTasks || []
})

// Methods
const getStatusClass = (status) => {
  const classes = {
    'PENDING': 'bg-yellow-100 text-yellow-800',
    'IN_PROGRESS': 'bg-blue-100 text-blue-800',
    'COMPLETED': 'bg-green-100 text-green-800',
    'CANCELLED': 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getStatusLabel = (status) => {
  const labels = {
    'PENDING': 'Pendente',
    'IN_PROGRESS': 'Em Progresso',
    'COMPLETED': 'Concluída',
    'CANCELLED': 'Cancelada'
  }
  return labels[status] || status
}

const getPriorityClass = (priority) => {
  const classes = {
    'LOW': 'bg-gray-100 text-gray-800',
    'MEDIUM': 'bg-yellow-100 text-yellow-800',
    'HIGH': 'bg-orange-100 text-orange-800',
    'URGENT': 'bg-red-100 text-red-800'
  }
  return classes[priority] || 'bg-gray-100 text-gray-800'
}

const getPriorityLabel = (priority) => {
  const labels = {
    'LOW': 'Baixa',
    'MEDIUM': 'Média',
    'HIGH': 'Alta',
    'URGENT': 'Urgente'
  }
  return labels[priority] || priority
}

const loadDashboardData = async () => {
  loading.value = true
  try {
    await Promise.all([
      reportsStore.fetchDashboard(),
      tasksStore.fetchMyTasks()
    ])
  } catch (error) {
    console.error('Erro ao carregar dados do dashboard:', error)
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadDashboardData()
})
</script>
