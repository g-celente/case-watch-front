<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Minhas Tarefas</h1>
        <p class="mt-1 text-sm text-gray-500">
          Tarefas atribuídas a você
        </p>
      </div>
      
      <div class="flex items-center space-x-3">
        <!-- Create Task Button -->
        <button
          @click="openTaskForm()"
          class="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          <Plus class="h-4 w-4 mr-2" />
          Nova Tarefa
        </button>
        
        <!-- View Toggle -->
        <div class="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1">
          <button
            @click="viewMode = 'list'"
            :class="[
              'inline-flex items-center rounded-md px-3 py-2 text-sm font-medium transition-all',
              viewMode === 'list'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            ]"
          >
            <List class="h-4 w-4 mr-2" />
            Lista
          </button>
          <button
            @click="viewMode = 'kanban'"
            :class="[
              'inline-flex items-center rounded-md px-3 py-2 text-sm font-medium transition-all',
              viewMode === 'kanban'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            ]"
          >
            <Grid3X3 class="h-4 w-4 mr-2" />
            Kanban
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="h-8 w-8 rounded-md bg-blue-100 flex items-center justify-center">
              <Clock class="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-500">Pendentes</p>
            <p class="text-2xl font-semibold text-gray-900">{{ myTasksStats.pending }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="h-8 w-8 rounded-md bg-yellow-100 flex items-center justify-center">
              <Play class="h-5 w-5 text-yellow-600" />
            </div>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-500">Em Progresso</p>
            <p class="text-2xl font-semibold text-gray-900">{{ myTasksStats.inProgress }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="h-8 w-8 rounded-md bg-green-100 flex items-center justify-center">
              <CheckCircle class="h-5 w-5 text-green-600" />
            </div>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-500">Concluídas</p>
            <p class="text-2xl font-semibold text-gray-900">{{ myTasksStats.completed }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="h-8 w-8 rounded-md bg-red-100 flex items-center justify-center">
              <AlertTriangle class="h-5 w-5 text-red-600" />
            </div>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-500">Atrasadas</p>
            <p class="text-2xl font-semibold text-gray-900">{{ myTasksStats.overdue }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg border border-gray-200 p-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
          <div class="relative">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              v-model="filters.search"
              type="text"
              placeholder="Buscar tarefas..."
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            v-model="filters.status"
            class="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="">Todos os status</option>
            <option value="PENDING">Pendente</option>
            <option value="IN_PROGRESS">Em Progresso</option>
            <option value="COMPLETED">Concluída</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Prioridade</label>
          <select
            v-model="filters.priority"
            class="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="">Todas as prioridades</option>
            <option value="URGENT">Urgente</option>
            <option value="HIGH">Alta</option>
            <option value="MEDIUM">Média</option>
            <option value="LOW">Baixa</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
          <select
            v-model="filters.categoryId"
            class="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="">Todas as categorias</option>
            <option
              v-for="category in categoriesStore.categoriesOptions"
              :key="category.value"
              :value="category.value"
            >
              {{ category.label }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
    </div>
    
    <div v-else-if="filteredTasks.length === 0" class="text-center py-12">
      <Inbox class="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">Nenhuma tarefa encontrada</h3>
      <p class="text-gray-500">
        {{ hasActiveFilters ? 'Tente ajustar os filtros ou' : 'Você não tem tarefas atribuídas no momento.' }}
      </p>
    </div>

    <!-- List View -->
    <div v-else-if="viewMode === 'list'" class="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tarefa
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prioridade
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vencimento
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoria
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="task in filteredTasks" :key="task.id" class="hover:bg-gray-50">
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ task.title }}</div>
                    <div class="text-sm text-gray-500 truncate max-w-md">{{ task.description }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <select
                  v-if="canUserEditTask(task)"
                  :value="task.status"
                  @change="updateTaskStatus(task.id, $event.target.value)"
                  class="text-xs border-0 bg-transparent focus:ring-0 rounded-full px-2 py-1"
                  :class="getStatusClass(task.status)"
                >
                  <option value="PENDING">Pendente</option>
                  <option value="IN_PROGRESS">Em Progresso</option>
                  <option value="COMPLETED">Concluída</option>
                </select>
                <span 
                  v-else
                  :class="getStatusClass(task.status)" 
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                >
                  {{ getStatusLabel(task.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getPriorityClass(task.priority)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                  {{ getPriorityLabel(task.priority) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <div v-if="task.dueDate" :class="getDueDateClass(task.dueDate)">
                  {{ formatDate(task.dueDate) }}
                </div>
                <span v-else class="text-gray-400">Sem prazo</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  v-if="task.category"
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  :style="{ backgroundColor: task.category.color + '20', color: task.category.color }"
                >
                  {{ task.category.name }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center space-x-2">
                  <button
                    @click="openTaskDetail(task)"
                    class="text-purple-600 hover:text-purple-900"
                    title="Ver detalhes"
                  >
                    <Eye class="h-4 w-4" />
                  </button>
                  <button
                    v-if="canUserEditTask(task)"
                    @click="editTask(task)"
                    class="text-blue-600 hover:text-blue-900"
                    title="Editar tarefa"
                  >
                    <Edit3 class="h-4 w-4" />
                  </button>
                  <button
                    v-if="canUserEditTask(task) && task.status !== 'COMPLETED'"
                    @click="markAsCompleted(task)"
                    class="text-green-600 hover:text-green-900"
                    title="Marcar como concluída"
                  >
                    <CheckCircle class="h-4 w-4" />
                  </button>
                  <!-- Indicator for view-only access -->
                  <span
                    v-if="!canUserEditTask(task)"
                    class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full"
                    title="Acesso somente leitura"
                  >
                    👁️ Visualizador
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Kanban View -->
    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Pending Column -->
      <div class="bg-gray-50 rounded-lg p-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-medium text-gray-900 flex items-center">
            <Clock class="h-4 w-4 mr-2 text-yellow-500" />
            Pendente ({{ kanbanTasks.pending.length }})
          </h3>
          <span class="text-xs text-gray-500">Clique para visualizar</span>
        </div>
        <div class="space-y-3">
          <TaskCard
            v-for="task in kanbanTasks.pending"
            :key="task.id"
            :task="task"
            @view="openTaskDetail"
            @edit="editTask"
            @delete="deleteTask"
            class="cursor-pointer hover:scale-[1.02] transition-transform"
          />
        </div>
      </div>

      <!-- In Progress Column -->
      <div class="bg-gray-50 rounded-lg p-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-medium text-gray-900 flex items-center">
            <Play class="h-4 w-4 mr-2 text-blue-500" />
            Em Progresso ({{ kanbanTasks.inProgress.length }})
          </h3>
          <span class="text-xs text-gray-500">Clique para visualizar</span>
        </div>
        <div class="space-y-3">
          <TaskCard
            v-for="task in kanbanTasks.inProgress"
            :key="task.id"
            :task="task"
            @view="openTaskDetail"
            @edit="editTask"
            @delete="deleteTask"
            class="cursor-pointer hover:scale-[1.02] transition-transform"
          />
        </div>
      </div>

      <!-- Completed Column -->
      <div class="bg-gray-50 rounded-lg p-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-medium text-gray-900 flex items-center">
            <CheckCircle class="h-4 w-4 mr-2 text-green-500" />
            Concluída ({{ kanbanTasks.completed.length }})
          </h3>
          <span class="text-xs text-gray-500">Clique para visualizar</span>
        </div>
        <div class="space-y-3">
          <TaskCard
            v-for="task in kanbanTasks.completed"
            :key="task.id"
            :task="task"
            @view="openTaskDetail"
            @edit="editTask"
            @delete="deleteTask"
            class="cursor-pointer hover:scale-[1.02] transition-transform"
          />
        </div>
      </div>
    </div>

    <!-- Task Detail Modal -->
    <TaskDetailModal
      :is-open="showTaskDetail"
      :task="selectedTask"
      @close="showTaskDetail = false"
      @updated="refreshTasks"
    />

    <!-- Task Form Modal -->
    <TaskFormDialog
      :is-open="showTaskForm"
      :task="taskToEdit"
      @close="closeTaskForm"
      @saved="handleTaskSaved"
    />

    <!-- Quick Status Modal -->
    <TaskQuickStatusModal
      :is-open="showQuickStatus"
      :task="taskForQuickStatus"
      @close="closeQuickStatusModal"
      @updated="refreshTasks"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { 
  List, 
  Grid3X3, 
  Clock, 
  Play, 
  CheckCircle, 
  AlertTriangle, 
  Search, 
  Eye, 
  Inbox,
  Plus,
  Edit3
} from 'lucide-vue-next'
import { useTasksStore } from '../stores/tasks.js'
import { useCategoriesStore } from '../stores/categories.js'
import { useAuthStore } from '../stores/auth/auth.js'
import { useToast } from '../composables/useToast.js'
import TaskCard from '../components/task/TaskCard.vue'
import TaskDetailModal from '../components/task/TaskDetailModal.vue'
import TaskFormDialog from '../components/task/TaskFormDialog.vue'
import TaskQuickStatusModal from '../components/task/TaskQuickStatusModal.vue'

const tasksStore = useTasksStore()
const categoriesStore = useCategoriesStore()
const authStore = useAuthStore()
const { showToast } = useToast()

// State
const viewMode = ref('list')
const loading = ref(false)
const showTaskDetail = ref(false)
const showTaskForm = ref(false)
const showQuickStatus = ref(false)
const selectedTask = ref(null)
const taskToEdit = ref(null)
const taskForQuickStatus = ref(null)

const filters = ref({
  search: '',
  status: '',
  priority: '',
  categoryId: ''
})

// Computed
const myTasks = computed(() => {
  // Since we're using fetchMyTasks, the store already contains only user's tasks
  return tasksStore.tasks
})

const myTasksStats = computed(() => {
  return {
    pending: myTasks.value.filter(t => t.status === 'PENDING').length,
    inProgress: myTasks.value.filter(t => t.status === 'IN_PROGRESS').length,
    completed: myTasks.value.filter(t => t.status === 'COMPLETED').length,
    overdue: myTasks.value.filter(t => {
      if (!t.dueDate || t.status === 'COMPLETED') return false
      return new Date(t.dueDate) < new Date()
    }).length
  }
})

const filteredTasks = computed(() => {
  let tasks = myTasks.value

  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    tasks = tasks.filter(task =>
      task.title.toLowerCase().includes(search) ||
      task.description?.toLowerCase().includes(search)
    )
  }

  if (filters.value.status) {
    tasks = tasks.filter(task => task.status === filters.value.status)
  }

  if (filters.value.priority) {
    tasks = tasks.filter(task => task.priority === filters.value.priority)
  }

  if (filters.value.categoryId) {
    tasks = tasks.filter(task => task.categoryId === filters.value.categoryId)
  }

  return tasks
})

const kanbanTasks = computed(() => {
  return {
    pending: filteredTasks.value.filter(t => t.status === 'PENDING'),
    inProgress: filteredTasks.value.filter(t => t.status === 'IN_PROGRESS'),
    completed: filteredTasks.value.filter(t => t.status === 'COMPLETED')
  }
})

const hasActiveFilters = computed(() => {
  return filters.value.search || filters.value.status || filters.value.priority || filters.value.categoryId
})

// Methods
const getUserTaskPermissions = (task) => {
  if (!task || !authStore.currentUser) {
    return { canEdit: false, canDelete: false, canView: true }
  }

  const currentUserId = authStore.currentUser.id
  
  // Check if user is the owner (both ownerId and owner.id for compatibility)
  const isOwner = task.owner.id === currentUserId || task.ownerId === currentUserId
  console.log(isOwner)
  if (isOwner) {
    return { canEdit: true, canDelete: true, canView: true }
  }
  
  // Check if user is the assignee (both singular and plural formats)
  const isAssignee = task.assignee?.id === currentUserId || 
                    (task.assignees && Array.isArray(task.assignees) && task.assignees.some(a => a.id === currentUserId))
  
  if (isAssignee) {
    return { canEdit: true, canDelete: false, canView: true }
  }
  
  // Check if user is a collaborator
  const collaborator = task.collaborators?.find(c => c.id === currentUserId)
  if (collaborator) {
    const role = collaborator.role
    return {
      canEdit: ['OWNER', 'ADMIN', 'EDITOR'].includes(role),
      canDelete: ['OWNER', 'ADMIN'].includes(role),
      canView: true
    }
  }
  
  // Default: can only view
  return { canEdit: false, canDelete: false, canView: true }
}

const canUserEditTask = (task) => {
  return getUserTaskPermissions(task).canEdit
}

const canUserDeleteTask = (task) => {
  return getUserTaskPermissions(task).canDelete
}

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

const getDueDateClass = (dueDate) => {
  const due = new Date(dueDate)
  const now = new Date()
  const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) return 'text-red-600 font-medium'
  if (diffDays <= 1) return 'text-orange-600 font-medium'
  if (diffDays <= 3) return 'text-yellow-600'
  return 'text-gray-600'
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const updateTaskStatus = async (taskId, newStatus) => {
  const task = tasksStore.tasks.find(t => t.id === taskId)
  
  if (!task) {
    showToast('Tarefa não encontrada', 'error')
    return
  }

  if (!canUserEditTask(task)) {
    showToast('Você não tem permissão para editar esta tarefa', 'error')
    return
  }

  try {
    await tasksStore.updateTaskStatus(taskId, newStatus)
    showToast('Status atualizado com sucesso!', 'success')
  } catch (error) {
    showToast('Erro ao atualizar status', 'error')
  }
}

const markAsCompleted = async (task) => {
  if (!canUserEditTask(task)) {
    showToast('Você não tem permissão para editar esta tarefa', 'error')
    return
  }
  
  if (confirm('Marcar esta tarefa como concluída?')) {
    await updateTaskStatus(task.id, 'COMPLETED')
  }
}

const openTaskDetail = (task) => {
  selectedTask.value = task
  showTaskDetail.value = true
}

const openQuickStatusModal = (task) => {
  taskForQuickStatus.value = task
  showQuickStatus.value = true
}

const closeQuickStatusModal = () => {
  showQuickStatus.value = false
  taskForQuickStatus.value = null
}

const openTaskForm = (task = null) => {
  taskToEdit.value = task
  showTaskForm.value = true
}

const closeTaskForm = () => {
  showTaskForm.value = false
  taskToEdit.value = null
}

const handleTaskSaved = async () => {
  closeTaskForm()
  await refreshTasks()
  showToast(taskToEdit.value ? 'Tarefa atualizada com sucesso!' : 'Tarefa criada com sucesso!', 'success')
}

const editTask = (task) => {
  // Check if user has permission to edit
  if (!canUserEditTask(task)) {
    showToast('Você não tem permissão para editar esta tarefa', 'error')
    return
  }
  openTaskForm(task)
}

const deleteTask = async (task) => {
  // Check if user has permission to delete
  if (!canUserDeleteTask(task)) {
    showToast('Você não tem permissão para excluir esta tarefa', 'error')
    return
  }
  
  if (confirm('Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita.')) {
    try {
      await tasksStore.deleteTask(task.id)
      showToast('Tarefa excluída com sucesso!', 'success')
    } catch (error) {
      showToast('Erro ao excluir tarefa', 'error')
    }
  }
}

const refreshTasks = async () => {
  await tasksStore.fetchMyTasks()
}

// Lifecycle
onMounted(async () => {
  loading.value = true
  
  try {
    await Promise.all([
      tasksStore.fetchMyTasks(),
      categoriesStore.fetchCategories()
    ])
    
  } catch (error) {
    showToast('Erro ao carregar dados', 'error')
  } finally {
    loading.value = false
  }
})

// Watch filters for real-time updates
watch(filters, async (newFilters) => {
  // Debounce search and other filters
  clearTimeout(filterTimeout)
  filterTimeout = setTimeout(async () => {
    await tasksStore.fetchMyTasks(newFilters)
  }, 300)
}, { deep: true })

let filterTimeout = null
</script>
