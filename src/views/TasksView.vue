<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Tarefas</h1>
        <p class="text-gray-600 dark:text-gray-400">Gerencie todas as suas tarefas</p>
      </div>
      <Button @click="createTask" class="bg-primary hover:bg-primary/90">
        <Plus class="w-4 h-4 mr-2" />
        Nova Tarefa
      </Button>
    </div>

    <!-- Filters -->
    <Card>
      <CardContent class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label for="status">Status</Label>
            <select
              id="status"
              v-model="filters.status"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            >
              <option value="">Todos</option>
              <option value="pending">Pendente</option>
              <option value="in_progress">Em Andamento</option>
              <option value="completed">Concluída</option>
            </select>
          </div>
          <div>
            <Label for="priority">Prioridade</Label>
            <select
              id="priority"
              v-model="filters.priority"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            >
              <option value="">Todas</option>
              <option value="low">Baixa</option>
              <option value="medium">Média</option>
              <option value="high">Alta</option>
            </select>
          </div>
          <div>
            <Label for="search">Buscar</Label>
            <Input
              id="search"
              v-model="filters.search"
              placeholder="Buscar tarefas..."
              class="mt-1"
            />
          </div>
          <div class="flex items-end">
            <Button @click="clearFilters" variant="outline" class="w-full">
              Limpar Filtros
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Tasks List -->
    <div class="grid gap-4">
      <div v-if="isLoading" class="text-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p class="text-gray-500 dark:text-gray-400 mt-2">Carregando tarefas...</p>
      </div>

      <div v-else-if="tasks.length === 0" class="text-center py-12">
        <CheckCircle class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Nenhuma tarefa encontrada
        </h3>
        <p class="text-gray-500 dark:text-gray-400 mb-6">
          Comece criando sua primeira tarefa
        </p>
        <Button @click="createTask">
          <Plus class="w-4 h-4 mr-2" />
          Criar Tarefa
        </Button>
      </div>

      <Card v-for="task in tasks" :key="task.id" class="hover:shadow-md transition-shadow">
        <CardContent class="p-6">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center space-x-3 mb-2">
                <div
                  class="w-3 h-3 rounded-full"
                  :class="{
                    'bg-green-500': task.status === 'completed',
                    'bg-yellow-500': task.status === 'in_progress',
                    'bg-gray-400': task.status === 'pending'
                  }"
                ></div>
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                  {{ task.title }}
                </h3>
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="{
                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': task.priority === 'low',
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200': task.priority === 'medium',
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200': task.priority === 'high'
                  }"
                >
                  {{ task.priority }}
                </span>
              </div>
              <p class="text-gray-600 dark:text-gray-400 mb-4">
                {{ task.description }}
              </p>
              <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Calendar class="w-4 h-4 mr-1" />
                <span>{{ formatDate(task.dueDate) }}</span>
                <span class="mx-2">•</span>
                <span>{{ task.category?.name || 'Sem categoria' }}</span>
              </div>
            </div>
            <div class="flex items-center space-x-2 ml-4">
              <Button @click="editTask(task)" variant="outline" size="sm">
                <Edit class="w-4 h-4" />
              </Button>
              <Button @click="deleteTask(task)" variant="destructive" size="sm">
                <Trash2 class="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  Plus,
  CheckCircle,
  Calendar,
  Edit,
  Trash2
} from 'lucide-vue-next'

// Components
import Card from '../components/ui/Card.vue'
import CardContent from '../components/ui/CardContent.vue'
import Button from '../components/ui/Button.vue'
import Input from '../components/ui/Input.vue'
import Label from '../components/ui/Label.vue'

const router = useRouter()

const isLoading = ref(false)
const tasks = ref([
  // Mock data - substituir por dados reais da API
  {
    id: 1,
    title: 'Finalizar relatório mensal',
    description: 'Completar análise de vendas de janeiro',
    status: 'in_progress',
    priority: 'high',
    dueDate: new Date(Date.now() + 86400000),
    category: { name: 'Trabalho' }
  },
  {
    id: 2,
    title: 'Reunião com cliente',
    description: 'Apresentar proposta do novo projeto',
    status: 'pending',
    priority: 'medium',
    dueDate: new Date(Date.now() + 2 * 86400000),
    category: { name: 'Reuniões' }
  }
])

const filters = reactive({
  status: '',
  priority: '',
  search: ''
})

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

const editTask = (task) => {
  router.push(`/tasks/${task.id}`)
}

const deleteTask = (task) => {
  if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
    // Implementar exclusão via API
    console.log('Excluir tarefa:', task.id)
  }
}

const clearFilters = () => {
  filters.status = ''
  filters.priority = ''
  filters.search = ''
}

const loadTasks = async () => {
  try {
    isLoading.value = true
    // Implementar carregamento via API
    // const response = await api.get('/api/tasks/my', { params: filters })
    // tasks.value = response.data.data
  } catch (error) {
    console.error('Erro ao carregar tarefas:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadTasks()
})
</script>
