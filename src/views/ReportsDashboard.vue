<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Dashboard de Relatórios</h1>
        <p class="mt-1 text-sm text-gray-500">
          Visão geral de métricas e analytics do sistema
        </p>
      </div>
      
      <div class="flex items-center space-x-3">
        <!-- Export Button -->
        <button
          @click="showExportModal = true"
          class="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          <Download class="h-4 w-4 mr-2" />
          Exportar
        </button>
        
        <!-- Refresh Button -->
        <button
          @click="refreshData"
          :disabled="loading"
          class="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-75 transition-all duration-200"
        >
          <RefreshCw class="h-4 w-4 mr-2" :class="{ 'animate-spin': loading }" />
          {{ loading ? 'Atualizando...' : 'Atualizar' }}
        </button>
      </div>
    </div>

    <!-- Filters -->
    <ReportFilters
      :filters="reportsStore.filters"
      :categories="categoriesStore.categoriesOptions"
      :users="authStore.availableUsers"
      :loading="loading"
      @apply="handleFiltersApply"
    />

    <!-- Main Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Total Tasks -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="h-8 w-8 rounded-md bg-blue-100 flex items-center justify-center">
              <BarChart3 class="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-500">Total de Tarefas</p>
            <p class="text-2xl font-semibold text-gray-900">{{ reportsStore.totalTasks }}</p>
          </div>
        </div>
      </div>
      
      <!-- Completion Rate -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="h-8 w-8 rounded-md bg-green-100 flex items-center justify-center">
              <CheckCircle class="h-5 w-5 text-green-600" />
            </div>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-500">Taxa de Conclusão</p>
            <p class="text-2xl font-semibold text-gray-900">{{ reportsStore.completionRate }}%</p>
          </div>
        </div>
      </div>
      
      <!-- Active Users -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="h-8 w-8 rounded-md bg-purple-100 flex items-center justify-center">
              <Users class="h-5 w-5 text-purple-600" />
            </div>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-500">Usuários Ativos</p>
            <p class="text-2xl font-semibold text-gray-900">{{ Array.isArray(reportsStore.userPerformance) ? reportsStore.userPerformance.length : 0 }}</p>
          </div>
        </div>
      </div>
      
      <!-- Avg Completion Time -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="h-8 w-8 rounded-md bg-amber-100 flex items-center justify-center">
              <Clock class="h-5 w-5 text-amber-600" />
            </div>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-500">Tempo Médio</p>
            <p class="text-2xl font-semibold text-gray-900">
              {{ averageCompletionTime }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Tasks by Status Chart -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">Distribuição por Status</h3>
          <button
            @click="exportChart('tasks-by-status')"
            class="text-sm text-purple-600 hover:text-purple-700"
          >
            <Download class="h-4 w-4" />
          </button>
        </div>
        <div class="h-80">
          <BaseChart
            v-if="reportsStore.tasksByStatus && reportsStore.tasksByStatus.length"
            :data="reportsStore.tasksByStatus"
            type="doughnut"
            :colors="statusColors"
          />
          <div v-else-if="loading" class="flex items-center justify-center h-full">
            <div class="text-center">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
              <p class="text-sm text-gray-500">Carregando dados...</p>
            </div>
          </div>
          <div v-else class="flex items-center justify-center h-full text-gray-500">
            <div class="text-center">
              <BarChart3 class="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>Nenhum dado disponível</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tasks by Category Chart -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">Tarefas por Categoria</h3>
          <button
            @click="exportChart('tasks-by-category')"
            class="text-sm text-purple-600 hover:text-purple-700"
          >
            <Download class="h-4 w-4" />
          </button>
        </div>
        <div class="h-80">
          <BaseChart
            v-if="reportsStore.tasksByCategory && reportsStore.tasksByCategory.length"
            :data="reportsStore.tasksByCategory"
            type="bar"
          />
          <div v-else-if="loading" class="flex items-center justify-center h-full">
            <div class="text-center">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
              <p class="text-sm text-gray-500">Carregando dados...</p>
            </div>
          </div>
          <div v-else class="flex items-center justify-center h-full text-gray-500">
            <div class="text-center">
              <BarChart3 class="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>Nenhum dado disponível</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Productivity and Performance -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Productivity Chart -->
      <div class="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">Produtividade no Tempo</h3>
          <div class="flex items-center space-x-2">
            <select
              v-model="productivityPeriod"
              @change="loadProductivityData"
              class="text-sm border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="weekly">Semanal</option>
              <option value="monthly">Mensal</option>
            </select>
            <button
              @click="exportChart('productivity')"
              class="text-sm text-purple-600 hover:text-purple-700"
            >
              <Download class="h-4 w-4" />
            </button>
          </div>
        </div>
        <div class="h-80">
          <BaseChart
            v-if="productivityData && productivityData.length"
            :data="productivityData"
            type="line"
          />
          <div v-else-if="loading" class="flex items-center justify-center h-full">
            <div class="text-center">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
              <p class="text-sm text-gray-500">Carregando dados...</p>
            </div>
          </div>
          <div v-else class="flex items-center justify-center h-full text-gray-500">
            <div class="text-center">
              <TrendingUp class="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>Nenhum dado disponível</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Performers -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">Top Performers</h3>
          <Trophy class="h-5 w-5 text-amber-500" />
        </div>
        <div class="space-y-3">
          <div
            v-for="(user, index) in reportsStore.topPerformers || []"
            :key="user?.id || index"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div
                  class="h-8 w-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                  :class="getRankClass(index)"
                >
                  {{ index + 1 }}
                </div>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-900">{{ user?.name || 'Usuário' }}</p>
                <p class="text-xs text-gray-500">{{ user?.completedTasks || 0 }} tarefas</p>
              </div>
            </div>
            <div class="text-sm font-semibold text-gray-900">
              {{ user?.completionRate || 0 }}%
            </div>
          </div>
          
          <!-- Estado de carregamento -->
          <template v-if="loading && (!reportsStore.topPerformers || reportsStore.topPerformers.length === 0)">
            <div class="text-center py-6">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
              <p class="text-sm text-gray-500">Carregando dados...</p>
            </div>
          </template>
          
          <!-- Estado vazio -->
          <template v-if="!loading && (!reportsStore.topPerformers || reportsStore.topPerformers.length === 0)">
            <div class="text-center py-6 text-gray-500">
              <Users class="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p class="text-sm">Nenhum dado disponível</p>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="bg-white rounded-lg border border-gray-200 p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-medium text-gray-900">Atividade Recente</h3>
        <button
          @click="$router.push('/tasks')"
          class="text-sm text-purple-600 hover:text-purple-700 font-medium"
        >
          Ver todas →
        </button>
      </div>
      
      <div class="space-y-3">
        <div
          v-for="(task, index) in recentActivities"
          :key="task?.id || index"
          class="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div
                class="h-2 w-2 rounded-full"
                :class="{
                  'bg-yellow-500': task?.status === 'PENDING',
                  'bg-blue-500': task?.status === 'IN_PROGRESS',
                  'bg-green-500': task?.status === 'COMPLETED',
                  'bg-red-500': task?.status === 'CANCELLED'
                }"
              ></div>
            </div>
            <div class="ml-3">
              <p class="text-sm text-gray-900">{{ task?.title || 'Tarefa' }}</p>
              <p class="text-xs text-gray-500">{{ formatRelativeTime(task?.createdAt) }}</p>
            </div>
          </div>
          <div class="text-xs text-gray-500">
            {{ task?.owner?.name || 'Usuário' }}
          </div>
        </div>
        
        <!-- Estado de carregamento -->
        <template v-if="loading && recentActivities.length === 0">
          <div class="text-center py-6">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
            <p class="text-sm text-gray-500">Carregando atividades...</p>
          </div>
        </template>
        
        <!-- Estado vazio -->
        <template v-if="!loading && recentActivities.length === 0">
          <div class="text-center py-6 text-gray-500">
            <Activity class="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p class="text-sm">Nenhuma atividade recente</p>
          </div>
        </template>
      </div>
    </div>

    <!-- Export Modal -->
    <ExportModal
      :is-open="showExportModal"
      @close="showExportModal = false"
      @export="handleExport"
    />

    <!-- Loading Overlay -->
    <div
      v-if="loading"
      class="fixed right-4 bottom-4 bg-white rounded-lg shadow-lg p-3 flex items-center space-x-3 z-50"
    >
      <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
      <span class="text-sm text-gray-900">Atualizando...</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  BarChart3,
  CheckCircle,
  Users,
  Clock,
  Download,
  RefreshCw,
  TrendingUp,
  Trophy,
  Activity
} from 'lucide-vue-next'
import { useReportsStore } from '../stores/reports.js'
import { useCategoriesStore } from '../stores/categories.js'
import { useAuthStore } from '../stores/auth/auth.js'
import { useToast } from '../composables/useToast.js'
import BaseChart from '../components/charts/BaseChart.vue'
import ReportFilters from '../components/reports/ReportFilters.vue'
import ExportModal from '../components/reports/ExportModal.vue'

const reportsStore = useReportsStore()
const categoriesStore = useCategoriesStore()
const authStore = useAuthStore()
const { showToast } = useToast()

// State
const loading = ref(false)
const showExportModal = ref(false)
const productivityPeriod = ref('monthly')

// Colors for charts
const statusColors = [
  '#F59E0B', // Pending - Amber
  '#3B82F6', // In Progress - Blue
  '#10B981', // Completed - Green
  '#EF4444'  // Cancelled - Red
]

// Computed
const averageCompletionTime = computed(() => {
  // Verificar se temos dados de performance de usuário
  if (Array.isArray(reportsStore.userPerformance) && reportsStore.userPerformance.length > 0) {
    const user = reportsStore.userPerformance[0]
    if (user && user.averageCompletionDays) {
      return `${user.averageCompletionDays.toFixed(1)}d`
    }
  }
  
  // Verificar se temos dados de produtividade
  const productivity = reportsStore.productivity
  if (Array.isArray(productivity) && productivity.length) {
    const avgHours = productivity.reduce((sum, item) => sum + (item.avgCompletionHours || 0), 0) / productivity.length
    return `${Math.round(avgHours)}h`
  }
  
  return '0d'
})

const productivityData = computed(() => {
  const data = productivityPeriod.value === 'weekly' 
    ? reportsStore.weeklyProductivity 
    : reportsStore.monthlyProductivity
  
  return Array.isArray(data) ? data : []
})

const recentActivities = computed(() => {
  // Usar dados reais da API quando disponível
  return Array.isArray(reportsStore.recentActivities) ? reportsStore.recentActivities : []
})

// Methods
const refreshData = async () => {
  loading.value = true
  try {
    // Exibir uma notificação de início de atualização
    showToast('Atualizando dados...', 'info', 1000)
    
    // Usar Promise.allSettled para continuar mesmo se algumas requisições falharem
    const results = await Promise.allSettled([
      reportsStore.loadAllDashboardData(),
      loadProductivityData()
    ])
    
    // Verificar se houve erros
    const errors = results.filter(r => r.status === 'rejected').map(r => r.reason)
    if (errors.length) {
      console.error('Alguns dados não puderam ser carregados:', errors)
      showToast('Alguns dados não puderam ser atualizados', 'warning')
    } else {
      showToast('Dados atualizados com sucesso!', 'success')
    }
  } catch (error) {
    console.error('Erro ao atualizar dados:', error)
    showToast('Erro ao atualizar dados', 'error')
  } finally {
    loading.value = false
  }
}

const loadProductivityData = async () => {
  try {
    const method = productivityPeriod.value === 'weekly' 
      ? reportsStore.fetchWeeklyProductivity 
      : reportsStore.fetchMonthlyProductivity
    
    await method()
  } catch (error) {
    console.error('Erro ao carregar dados de produtividade:', error)
  }
}

const handleFiltersApply = async (filters) => {
  reportsStore.setFilters(filters)
  await refreshData()
}

const exportChart = async (chartType) => {
  try {
    await reportsStore.exportReport(chartType, 'png')
    showToast('Gráfico exportado com sucesso!', 'success')
  } catch (error) {
    showToast('Erro ao exportar gráfico', 'error')
  }
}

const handleExport = async (config) => {
  try {
    await reportsStore.exportReport(config.type, config.format)
    showToast('Relatório exportado com sucesso!', 'success')
  } catch (error) {
    showToast('Erro ao exportar relatório', 'error')
  }
}

const getRankClass = (index) => {
  const classes = [
    'bg-yellow-500', // 1st - Gold
    'bg-gray-400',   // 2nd - Silver
    'bg-amber-600',  // 3rd - Bronze
    'bg-purple-500', // 4th+
    'bg-purple-500'
  ]
  return classes[index] || 'bg-purple-500'
}

const getActivityStatusClass = (type) => {
  const classes = {
    'completed': 'bg-green-500',
    'created': 'bg-blue-500',
    'updated': 'bg-amber-500',
    'deleted': 'bg-red-500'
  }
  return classes[type] || 'bg-gray-500'
}

const formatRelativeTime = (date) => {
  const now = new Date()
  const past = new Date(date)
  const diffMs = now - past
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  
  if (diffMins < 1) return 'Agora'
  if (diffMins < 60) return `${diffMins}m atrás`
  if (diffHours < 24) return `${diffHours}h atrás`
  return past.toLocaleDateString('pt-BR')
}

// Lifecycle
onMounted(async () => {
  loading.value = true
  try {
    await Promise.all([
      categoriesStore.fetchCategories(),
      authStore.fetchAvailableUsers?.() || Promise.resolve(),
      reportsStore.loadAllDashboardData(),
      loadProductivityData()
    ])
  } catch (error) {
    console.error('Erro ao carregar dados do dashboard:', error)
    showToast('Erro ao carregar dashboard', 'error')
  } finally {
    loading.value = false
  }
})
</script>
