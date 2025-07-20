<template>
  <div 
    @click="$emit('view', task)"
    class="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
  >
    <!-- Header -->
    <div class="flex items-start justify-between mb-4">
      <div class="flex-1">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ task.title }}</h3>
        <p class="text-sm text-gray-600 line-clamp-2">{{ task.description }}</p>
      </div>
      
      <!-- Actions Dropdown -->
      <div class="relative" v-if="canEdit || canDelete">
        <button
          @click.stop="showActions = !showActions"
          class="p-1 rounded-full hover:bg-gray-100"
        >
          <MoreVertical class="h-5 w-5 text-gray-400" />
        </button>
        
        <div
          v-if="showActions"
          v-click-outside="() => showActions = false"
          class="absolute right-0 top-8 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-10"
        >
          <button
            v-if="canEdit"
            @click.stop="$emit('edit', task)"
            class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <Edit class="h-4 w-4 inline mr-2" />
            Editar
          </button>
          <button
            v-if="canDelete"
            @click.stop="$emit('delete', task)"
            class="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50"
          >
            <Trash2 class="h-4 w-4 inline mr-2" />
            Excluir
          </button>
        </div>
      </div>
    </div>

    <!-- Status and Priority -->
    <div class="flex items-center space-x-2 mb-4">
      <span :class="getStatusClass(task.status)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
        {{ getStatusLabel(task.status) }}
      </span>
      <span :class="getPriorityClass(task.priority)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
        {{ getPriorityLabel(task.priority) }}
      </span>
      <span v-if="userRole" :class="getRoleBadgeClass(userRole)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
        {{ getRoleIcon(userRole) }} {{ getRoleLabel(userRole) }}
      </span>
    </div>

    <!-- Due Date -->
    <div v-if="task.dueDate" class="mb-4">
      <div class="flex items-center text-sm">
        <Calendar class="h-4 w-4 mr-2 text-gray-400" />
        <span :class="getDueDateClass(task.dueDate)">
          {{ formatDate(task.dueDate) }}
        </span>
      </div>
    </div>

    <!-- Assignee -->
    <div v-if="task.assignee" class="mb-4">
      <div class="flex items-center">
        <Pin class="h-4 w-4 mr-2 text-purple-600" />
        <span class="text-sm text-gray-700">Responsável:</span>
        <div class="ml-2 flex items-center">
          <div class="h-6 w-6 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-medium">
            {{ getInitials(task.assignee.name) }}
          </div>
          <span class="ml-2 text-sm font-medium text-gray-900">{{ task.assignee.name }}</span>
        </div>
      </div>
    </div>

    <!-- Collaborators -->
    <div v-if="task.collaborators && task.collaborators.length > 0" class="mb-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <Users class="h-4 w-4 mr-2 text-gray-400" />
          <span class="text-sm text-gray-700">Colaboradores</span>
        </div>
        <div class="flex -space-x-1">
          <div
            v-for="(collaborator, index) in visibleCollaborators"
            :key="collaborator.id"
            :title="`${collaborator.name} (${getRoleLabel(collaborator.role)})`"
            class="h-6 w-6 rounded-full bg-gray-600 flex items-center justify-center text-white text-xs font-medium border-2 border-white"
          >
            {{ getInitials(collaborator.name) }}
          </div>
          <div
            v-if="task.collaborators.length > 3"
            class="h-6 w-6 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs font-medium border-2 border-white"
            :title="`+${task.collaborators.length - 3} colaboradores`"
          >
            +{{ task.collaborators.length - 3 }}
          </div>
        </div>
      </div>
    </div>

    <!-- Category -->
    <div v-if="task.category" class="mb-4">
      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-gray-800" :style="{ backgroundColor: task.category.color + '20', color: task.category.color }">
        <Tag class="h-3 w-3 mr-1" />
        {{ task.category.name }}
      </span>
    </div>

    <!-- Footer -->
    <div class="flex items-center justify-between pt-4 border-t border-gray-200">
      <!-- Inline Edit Controls -->
      <div class="flex items-center space-x-2">
        <!-- Status Selector -->
        <select
          v-if="canEdit"
          :value="task.status"
          @change="handleStatusUpdate($event.target.value)"
          @click.stop
          class="text-xs border-0 bg-transparent focus:ring-0 text-gray-600"
        >
          <option value="PENDING">Pendente</option>
          <option value="IN_PROGRESS">Em Progresso</option>
          <option value="COMPLETED">Concluída</option>
          <option value="CANCELLED">Cancelada</option>
        </select>
        
        <!-- Priority Selector -->
        <select
          v-if="canEdit"
          :value="task.priority"
          @change="handlePriorityUpdate($event.target.value)"
          @click.stop
          class="text-xs border-0 bg-transparent focus:ring-0 text-gray-600"
        >
          <option value="LOW">Baixa</option>
          <option value="MEDIUM">Média</option>
          <option value="HIGH">Alta</option>
          <option value="URGENT">Urgente</option>
        </select>
      </div>

      <!-- Timestamp -->
      <div class="text-xs text-gray-500">
        {{ formatRelativeTime(task.updatedAt) }}
      </div>
    </div>

    <!-- Permission Indicators -->
    <div v-if="showPermissions" class="mt-4 pt-4 border-t border-gray-200">
      <div class="flex flex-wrap gap-2">
        <span v-if="canEdit" class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
          <Check class="h-3 w-3 mr-1" />
          Pode editar
        </span>
        <span v-if="canDelete" class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
          <Trash2 class="h-3 w-3 mr-1" />
          Pode excluir
        </span>
        <span v-if="canManageCollaborators" class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
          <Users class="h-3 w-3 mr-1" />
          Gerenciar colaboradores
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { 
  MoreVertical, 
  Edit, 
  Trash2, 
  Calendar, 
  Pin, 
  Users, 
  Tag, 
  Check 
} from 'lucide-vue-next'
import { useTasksStore } from '../../stores/tasks.js'
import { useAuthStore } from '../../stores/auth/auth.js'

// Click outside directive
const vClickOutside = {
  beforeMount(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}

const props = defineProps({
  task: {
    type: Object,
    required: true
  },
  showPermissions: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['edit', 'delete', 'view'])

const tasksStore = useTasksStore()
const authStore = useAuthStore()

// State
const showActions = ref(false)

// Computed
const userRole = computed(() => {
  if (!props.task.collaborators) return null
  
  const currentUser = authStore.currentUser
  if (!currentUser) return null
  
  if (props.task.owner?.id === currentUser.id) return 'OWNER'
  
  const collaboration = props.task.collaborators.find(c => c.id === currentUser.id)
  return collaboration?.role || null
})

const canEdit = computed(() => {
  return ['OWNER', 'ADMIN', 'EDITOR'].includes(userRole.value)
})

const canDelete = computed(() => {
  return ['OWNER', 'ADMIN'].includes(userRole.value)
})

const canManageCollaborators = computed(() => {
  return ['OWNER', 'ADMIN'].includes(userRole.value)
})

const visibleCollaborators = computed(() => {
  return props.task.collaborators?.slice(0, 3) || []
})

// Methods
const getInitials = (name) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

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

const formatRelativeTime = (date) => {
  const now = new Date()
  const past = new Date(date)
  const diffMs = now - past
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffMins < 1) return 'Agora'
  if (diffMins < 60) return `${diffMins}m atrás`
  if (diffHours < 24) return `${diffHours}h atrás`
  return `${diffDays}d atrás`
}

const handleStatusUpdate = async (newStatus) => {
  if (!canEdit.value) return
  
  try {
    await tasksStore.updateTaskStatus(props.task.id, newStatus)
  } catch (error) {
    console.error('Erro ao atualizar status:', error)
  }
}

const handlePriorityUpdate = async (newPriority) => {
  if (!canEdit.value) return
  
  try {
    await tasksStore.updateTaskPriority(props.task.id, newPriority)
  } catch (error) {
    console.error('Erro ao atualizar prioridade:', error)
  }
}
</script>

<style scoped>
.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
}
</style>
