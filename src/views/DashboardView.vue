<template>
  <TheContainer>
    <div class="space-y-6">
      <!-- Welcome Section -->
      <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h1 class="text-2xl font-bold text-gray-900 mb-2">
          Bem-vindo, {{ user?.name }}! 👋
        </h1>
        <p class="text-gray-600">
          Aqui está um resumo das suas tarefas e atividades.
        </p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent class="p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CheckCircle class="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Total de Tarefas
                </p>
                <p class="text-2xl font-semibold text-gray-900">
                  {{ stats.totalTasks }}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent class="p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Check class="w-5 h-5 text-green-600" />
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Concluídas
                </p>
                <p class="text-2xl font-semibold text-gray-900">
                  {{ stats.completedTasks }}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent class="p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock class="w-5 h-5 text-yellow-600" />
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Em Andamento
                </p>
                <p class="text-2xl font-semibold text-gray-900">
                  {{ stats.inProgressTasks }}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent class="p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertCircle class="w-5 h-5 text-red-600" />
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Atrasadas
                </p>
                <p class="text-2xl font-semibold text-gray-900">
                  {{ stats.overdueTasks }}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Recent Tasks -->
      <Card>
        <CardHeader>
          <CardTitle>Tarefas Recentes</CardTitle>
          <CardDescription>
            Suas tarefas mais recentes e importantes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div v-if="isLoading" class="text-center py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p class="text-gray-500 mt-2">Carregando tarefas...</p>
            </div>

            <div v-else-if="recentTasks.length === 0" class="text-center py-8">
              <CheckCircle class="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p class="text-gray-500">Nenhuma tarefa encontrada</p>
              <Button @click="createTask" class="mt-4">
                <Plus class="w-4 h-4 mr-2" />
                Criar primeira tarefa
              </Button>
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="task in recentTasks"
                :key="task.id"
                class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div class="flex items-center space-x-3">
                  <div
                    class="w-3 h-3 rounded-full"
                    :class="{
                      'bg-green-500': task.status === 'completed',
                      'bg-yellow-500': task.status === 'in_progress',
                      'bg-gray-400': task.status === 'pending',
                      'bg-red-500': task.status === 'overdue'
                    }"
                  ></div>
                  <div>
                    <p class="font-medium text-gray-900">{{ task.title }}</p>
                    <p class="text-sm text-gray-500">{{ task.description }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-sm text-gray-500">
                    {{ formatDate(task.dueDate) }}
                  </p>
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="{
                      'bg-green-100 text-green-800': task.priority === 'low',
                      'bg-yellow-100 text-yellow-800': task.priority === 'medium',
                      'bg-red-100 text-red-800': task.priority === 'high'
                    }"
                  >
                    {{ task.priority }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Quick Actions -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card class="hover:shadow-md transition-shadow cursor-pointer" @click="createTask">
          <CardContent class="p-6 text-center">
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Plus class="w-6 h-6 text-purple-600" />
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">
              Nova Tarefa
            </h3>
            <p class="text-gray-500">
              Crie uma nova tarefa rapidamente
            </p>
          </CardContent>
        </Card>

        <Card class="hover:shadow-md transition-shadow cursor-pointer" @click="viewTasks">
          <CardContent class="p-6 text-center">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <CheckCircle class="w-6 h-6 text-blue-600" />
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">
              Ver Todas as Tarefas
            </h3>
            <p class="text-gray-500">
              Gerencie todas as suas tarefas
            </p>
          </CardContent>
        </Card>

        <Card class="hover:shadow-md transition-shadow cursor-pointer" @click="viewReports">
          <CardContent class="p-6 text-center">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <BarChart3 class="w-6 h-6 text-green-600" />
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">
              Relatórios
            </h3>
            <p class="text-gray-500">
              Visualize seu progresso
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  </TheContainer>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth/auth.js'
import {
  CheckCircle,
  Check,
  Clock,
  AlertCircle,
  Plus,
  BarChart3
} from 'lucide-vue-next'

// Components
import TheContainer from '../components/TheContainer.vue'
import Card from '../components/ui/Card.vue'
import CardHeader from '../components/ui/CardHeader.vue'
import CardTitle from '../components/ui/CardTitle.vue'
import CardDescription from '../components/ui/CardDescription.vue'
import CardContent from '../components/ui/CardContent.vue'
import Button from '../components/ui/Button.vue'

const router = useRouter()
const authStore = useAuthStore()

const user = computed(() => authStore.user)

// Mock data - substituir por dados reais da API
const isLoading = ref(false)
const stats = ref({
  totalTasks: 24,
  completedTasks: 18,
  inProgressTasks: 4,
  overdueTasks: 2
})

const recentTasks = ref([
  {
    id: 1,
    title: 'Finalizar relatório mensal',
    description: 'Completar análise de vendas de janeiro',
    status: 'in_progress',
    priority: 'high',
    dueDate: new Date(Date.now() + 86400000) // Tomorrow
  },
  {
    id: 2,
    title: 'Reunião com cliente',
    description: 'Apresentar proposta do novo projeto',
    status: 'pending',
    priority: 'medium',
    dueDate: new Date(Date.now() + 2 * 86400000) // Day after tomorrow
  },
  {
    id: 3,
    title: 'Revisar código',
    description: 'Code review do módulo de autenticação',
    status: 'completed',
    priority: 'low',
    dueDate: new Date(Date.now() - 86400000) // Yesterday
  }
])

const formatDate = (date) => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(date))
}

const createTask = () => {
  router.push('/tasks/new')
}

const viewTasks = () => {
  router.push('/tasks')
}

const viewReports = () => {
  router.push('/reports')
}

// Carregar dados do dashboard
const loadDashboardData = async () => {
  try {
    isLoading.value = true
    // Aqui você fará as chamadas para a API real
    // const response = await api.get('/api/reports/dashboard')
    // stats.value = response.data.data
  } catch (error) {
    console.error('Erro ao carregar dados do dashboard:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadDashboardData()
})
</script>
