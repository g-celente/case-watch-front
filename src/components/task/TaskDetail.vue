<template>
  <div v-if="task" class="max-w-4xl mx-auto">
    <!-- Header -->
    <div class="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <div class="flex items-start justify-between mb-4">
        <div class="flex-1">
          <h1 v-if="!isEditing" class="text-2xl font-bold text-gray-900 mb-2">{{ task.title }}</h1>
          <BaseFormField
            v-else
            v-model="editForm.title"
            label=""
            placeholder="Título da tarefa"
            class="text-2xl font-bold"
          />
          
          <div v-if="!isEditing" class="prose max-w-none">
            <p class="text-gray-600">{{ task.description || 'Sem descrição' }}</p>
          </div>
          <BaseFormField
            v-else
            v-model="editForm.description"
            label=""
            type="textarea"
            placeholder="Descrição da tarefa"
            rows="3"
          />
        </div>
        
        <!-- Action Buttons -->
        <div class="flex items-center space-x-2 ml-4">
          <template v-if="!isEditing">
            <button
              v-if="canEdit"
              @click="startEditing"
              class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Edit class="h-4 w-4 mr-2" />
              Editar
            </button>
            <button
              v-if="canDelete"
              @click="handleDelete"
              class="inline-flex items-center px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 hover:bg-red-50"
            >
              <Trash2 class="h-4 w-4 mr-2" />
              Excluir
            </button>
          </template>
          <template v-else>
            <button
              @click="saveChanges"
              :disabled="loading"
              class="inline-flex items-center px-3 py-2 bg-purple-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50"
            >
              <Check class="h-4 w-4 mr-2" />
              {{ loading ? 'Salvando...' : 'Salvar' }}
            </button>
            <button
              @click="cancelEditing"
              class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <X class="h-4 w-4 mr-2" />
              Cancelar
            </button>
          </template>
        </div>
      </div>

      <!-- Status and Priority Row -->
      <div class="flex items-center flex-wrap gap-4 mb-4">
        <!-- Status -->
        <div class="flex items-center space-x-2">
          <label class="text-sm font-medium text-gray-700">Status:</label>
          <select
            v-if="canEdit"
            :value="task.status"
            @change="handleStatusUpdate($event.target.value)"
            class="text-sm border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="PENDING">Pendente</option>
            <option value="IN_PROGRESS">Em Progresso</option>
            <option value="COMPLETED">Concluída</option>
            <option value="CANCELLED">Cancelada</option>
          </select>
          <span v-else :class="getStatusClass(task.status)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
            {{ getStatusLabel(task.status) }}
          </span>
        </div>

        <!-- Priority -->
        <div class="flex items-center space-x-2">
          <label class="text-sm font-medium text-gray-700">Prioridade:</label>
          <select
            v-if="canEdit"
            :value="task.priority"
            @change="handlePriorityUpdate($event.target.value)"
            class="text-sm border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="LOW">Baixa</option>
            <option value="MEDIUM">Média</option>
            <option value="HIGH">Alta</option>
            <option value="URGENT">Urgente</option>
          </select>
          <span v-else :class="getPriorityClass(task.priority)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
            {{ getPriorityLabel(task.priority) }}
          </span>
        </div>

        <!-- Due Date -->
        <div v-if="task.dueDate" class="flex items-center space-x-2">
          <label class="text-sm font-medium text-gray-700">Vencimento:</label>
          <div class="flex items-center">
            <Calendar class="h-4 w-4 mr-1 text-gray-400" />
            <span :class="getDueDateClass(task.dueDate)" class="text-sm">
              {{ formatDate(task.dueDate) }}
            </span>
          </div>
        </div>

        <!-- Category -->
        <div v-if="task.category" class="flex items-center space-x-2">
          <label class="text-sm font-medium text-gray-700">Categoria:</label>
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-gray-800" :style="{ backgroundColor: task.category.color + '20', color: task.category.color }">
            <Tag class="h-3 w-3 mr-1" />
            {{ task.category.name }}
          </span>
        </div>
      </div>

      <!-- User Role Badge -->
      <div v-if="userRole" class="mb-4">
        <span :class="getRoleBadgeClass(userRole)" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium">
          {{ getRoleIcon(userRole) }} Seu papel: {{ getRoleLabel(userRole) }}
        </span>
      </div>

      <!-- Timestamps -->
      <div class="text-sm text-gray-500 border-t pt-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <strong>Criada em:</strong> {{ formatDateTime(task.createdAt) }}
          </div>
          <div>
            <strong>Última atualização:</strong> {{ formatDateTime(task.updatedAt) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Collaboration Panel -->
    <CollaborationPanel :task-id="task.id" />

    <!-- Permission Matrix -->
    <div v-if="showPermissionMatrix" class="bg-white rounded-lg border border-gray-200 p-6 mt-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Matriz de Permissões</h3>
      <PermissionMatrix :user-permissions="userPermissions" />
    </div>

    <!-- Activity Log (Future Implementation) -->
    <div class="bg-white rounded-lg border border-gray-200 p-6 mt-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Atividades Recentes</h3>
      <div class="text-center text-gray-500 py-8">
        <Clock class="h-8 w-8 mx-auto mb-2" />
        <p>Log de atividades será implementado em breve</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  Edit, 
  Trash2, 
  Check, 
  X, 
  Calendar, 
  Tag, 
  Clock 
} from 'lucide-vue-next'
import { useTasksStore } from '../../stores/tasks.js'
import { useAuthStore } from '../../stores/auth/auth.js'
import { useToast } from '../../composables/useToast.js'
import CollaborationPanel from './CollaborationPanel.vue'
import PermissionMatrix from './PermissionMatrix.vue'
import BaseFormField from './ui/BaseFormField.vue'

const route = useRoute()
const router = useRouter()
const tasksStore = useTasksStore()
const authStore = useAuthStore()
const { showToast } = useToast()

// State
const isEditing = ref(false)
const showPermissionMatrix = ref(false)
const editForm = ref({
  title: '',
  description: ''
})

// Computed
const task = computed(() => tasksStore.currentTask)
const userPermissions = computed(() => tasksStore.userPermissions)
const loading = computed(() => tasksStore.loading)

const userRole = computed(() => {
  if (!task.value?.collaborators) return null
  
  const currentUser = authStore.currentUser
  if (!currentUser) return null
  
  if (task.value.owner?.id === currentUser.id) return 'OWNER'
  
  const collaboration = task.value.collaborators.find(c => c.id === currentUser.id)
  return collaboration?.role || null
})

const canEdit = computed(() => {
  return userPermissions.value.canEdit || ['OWNER', 'ADMIN', 'EDITOR'].includes(userRole.value)
})

const canDelete = computed(() => {
  return userPermissions.value.canDelete || ['OWNER', 'ADMIN'].includes(userRole.value)
})

// Methods
const getStatusClass = (status) => {
  const classes = {
    'PENDING': 'bg-yellow-100 text-yellow-800',
    'IN_PROGRESS': 'bg-blue-100 text-blue-800',
    'COMPLETED': 'bg-green-100 text-green-800',
    'CANCELLED': 'bg-red-100 text-red-800',
    'OVERDUE': 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getStatusLabel = (status) => {
  const labels = {
    'PENDING': 'Pendente',
    'IN_PROGRESS': 'Em Progresso',
    'COMPLETED': 'Concluída',
    'CANCELLED': 'Cancelada',
    'OVERDUE': 'Atrasada'
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

const getRoleIcon = (role) => {
  const icons = {
    'OWNER': '👑',
    'ADMIN': '⚙️',
    'EDITOR': '✏️',
    'VIEWER': '👁️'
  }
  return icons[role] || '👁️'
}

const getRoleLabel = (role) => {
  const labels = {
    'OWNER': 'Proprietário',
    'ADMIN': 'Administrador',
    'EDITOR': 'Editor',
    'VIEWER': 'Visualizador'
  }
  return labels[role] || 'Visualizador'
}

const getRoleBadgeClass = (role) => {
  const classes = {
    'OWNER': 'bg-purple-100 text-purple-800',
    'ADMIN': 'bg-red-100 text-red-800',
    'EDITOR': 'bg-blue-100 text-blue-800',
    'VIEWER': 'bg-gray-100 text-gray-800'
  }
  return classes[role] || 'bg-gray-100 text-gray-800'
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

const formatDateTime = (date) => {
  return new Date(date).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const startEditing = () => {
  if (!canEdit.value) {
    showToast('Você não tem permissão para editar esta tarefa', 'error')
    return
  }
  
  editForm.value = {
    title: task.value.title,
    description: task.value.description || ''
  }
  isEditing.value = true
}

const cancelEditing = () => {
  isEditing.value = false
  editForm.value = {
    title: '',
    description: ''
  }
}

const saveChanges = async () => {
  try {
    await tasksStore.updateTask(task.value.id, editForm.value)
    showToast('Tarefa atualizada com sucesso!', 'success')
    isEditing.value = false
  } catch (error) {
    showToast('Erro ao atualizar tarefa', 'error')
  }
}

const handleStatusUpdate = async (newStatus) => {
  if (!canEdit.value) {
    showToast('Você não tem permissão para alterar o status desta tarefa', 'error')
    return
  }
  
  try {
    await tasksStore.updateTaskStatus(task.value.id, newStatus)
    showToast('Status atualizado com sucesso!', 'success')
  } catch (error) {
    showToast('Erro ao atualizar status', 'error')
  }
}

const handlePriorityUpdate = async (newPriority) => {
  if (!canEdit.value) {
    showToast('Você não tem permissão para alterar a prioridade desta tarefa', 'error')
    return
  }
  
  try {
    await tasksStore.updateTaskPriority(task.value.id, newPriority)
    showToast('Prioridade atualizada com sucesso!', 'success')
  } catch (error) {
    showToast('Erro ao atualizar prioridade', 'error')
  }
}

const handleDelete = async () => {
  if (!canDelete.value) {
    showToast('Você não tem permissão para excluir esta tarefa', 'error')
    return
  }
  
  if (confirm('Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita.')) {
    try {
      await tasksStore.deleteTask(task.value.id)
      showToast('Tarefa excluída com sucesso!', 'success')
      router.push('/tasks')
    } catch (error) {
      showToast('Erro ao excluir tarefa', 'error')
    }
  }
}

// Lifecycle
onMounted(async () => {
  const taskId = route.params.id
  if (taskId) {
    try {
      await tasksStore.fetchTask(taskId)
      if (task.value) {
        tasksStore.setCurrentTask(task.value)
      }
    } catch (error) {
      showToast('Erro ao carregar tarefa', 'error')
      router.push('/tasks')
    }
  }
})

// Watch for route changes
watch(() => route.params.id, async (newId) => {
  if (newId) {
    try {
      await tasksStore.fetchTask(newId)
      if (task.value) {
        tasksStore.setCurrentTask(task.value)
      }
    } catch (error) {
      showToast('Erro ao carregar tarefa', 'error')
      router.push('/tasks')
    }
  }
})
</script>
