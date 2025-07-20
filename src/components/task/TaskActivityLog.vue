<template>
  <div class="bg-white rounded-lg border border-gray-200 p-6">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-semibold text-gray-900 flex items-center">
        <Clock class="h-5 w-5 mr-2 text-purple-600" />
        Atividades Recentes
      </h3>
      
      <!-- Activity Filters -->
      <div class="flex items-center space-x-2">
        <select
          v-model="selectedFilter"
          @change="filterActivities"
          class="text-sm border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
        >
          <option value="all">Todas as atividades</option>
          <option value="task">Tarefa</option>
          <option value="collaboration">Colaboração</option>
          <option value="assignment">Atribuição</option>
          <option value="status">Status</option>
          <option value="comments">Comentários</option>
        </select>
        
        <button
          @click="refreshActivities"
          :disabled="loading"
          class="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
        >
          <RotateCcw class="h-4 w-4" :class="{ 'animate-spin': loading }" />
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading && activities.length === 0" class="flex items-center justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mr-3"></div>
      <span class="text-gray-500">Carregando atividades...</span>
    </div>

    <!-- Activities Timeline -->
    <div v-else-if="filteredActivities.length > 0" class="relative">
      <!-- Timeline Line -->
      <div class="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
      
      <div class="space-y-6">
        <div
          v-for="(activity, index) in filteredActivities"
          :key="activity.id"
          class="relative flex items-start space-x-3"
        >
          <!-- Avatar -->
          <div class="relative flex-shrink-0">
            <div class="h-8 w-8 rounded-full bg-white border-2 border-white shadow-sm flex items-center justify-center z-10"
                 :style="{ backgroundColor: getActivityColor(activity.type) }">
              <component 
                :is="getActivityIcon(activity.type)" 
                class="h-4 w-4 text-white" 
              />
            </div>
          </div>

          <!-- Activity Content -->
          <div class="flex-1 min-w-0">
            <div class="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <!-- Activity Header -->
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center space-x-2">
                  <div class="h-6 w-6 rounded-full bg-gray-600 flex items-center justify-center text-white text-xs font-medium">
                    {{ getInitials(activity.user.name) }}
                  </div>
                  <span class="text-sm font-medium text-gray-900">{{ activity.user.name }}</span>
                  <span class="text-xs text-gray-500">{{ getActivityAction(activity.type) }}</span>
                </div>
                <time class="text-xs text-gray-500" :title="formatFullDate(activity.createdAt)">
                  {{ formatRelativeTime(activity.createdAt) }}
                </time>
              </div>

              <!-- Activity Description -->
              <div class="text-sm text-gray-700 mb-2">
                {{ getActivityDescription(activity) }}
              </div>

              <!-- Activity Details/Changes -->
              <div v-if="activity.changes && Object.keys(activity.changes).length > 0" class="space-y-2">
                <div
                  v-for="(change, field) in activity.changes"
                  :key="field"
                  class="text-xs bg-white rounded border border-gray-200 p-2"
                >
                  <div class="flex items-center justify-between">
                    <span class="font-medium text-gray-600">{{ getFieldLabel(field) }}:</span>
                    <span class="text-gray-500">alterado</span>
                  </div>
                  <div class="mt-1 grid grid-cols-2 gap-2">
                    <div>
                      <span class="text-red-600 bg-red-50 px-1 rounded">
                        {{ formatFieldValue(field, change.from) }}
                      </span>
                    </div>
                    <div>
                      <span class="text-green-600 bg-green-50 px-1 rounded">
                        {{ formatFieldValue(field, change.to) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Collaboration Details -->
              <div v-if="activity.type === 'collaboration' && activity.metadata" class="mt-2">
                <div class="inline-flex items-center px-2 py-1 rounded-full text-xs"
                     :class="getRoleBadgeClass(activity.metadata.role)">
                  {{ getRoleIcon(activity.metadata.role) }} {{ getRoleLabel(activity.metadata.role) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Load More Button -->
      <div v-if="hasMore" class="mt-6 text-center">
        <button
          @click="loadMoreActivities"
          :disabled="loading"
          class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          <div v-if="loading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
          {{ loading ? 'Carregando...' : 'Carregar mais atividades' }}
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-8">
      <History class="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 class="text-sm font-medium text-gray-900 mb-2">Nenhuma atividade encontrada</h3>
      <p class="text-sm text-gray-500">
        {{ selectedFilter === 'all' ? 'Ainda não há atividades nesta tarefa.' : 'Nenhuma atividade corresponde ao filtro selecionado.' }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { 
  Clock, 
  RotateCcw, 
  History,
  Edit, 
  UserPlus, 
  UserMinus, 
  CheckCircle, 
  AlertCircle,
  MessageSquare,
  Pin,
  PinOff,
  Settings
} from 'lucide-vue-next'

const props = defineProps({
  taskId: {
    type: String,
    required: true
  }
})

// State
const activities = ref([])
const loading = ref(false)
const selectedFilter = ref('all')
const page = ref(1)
const hasMore = ref(true)

// Mock activities data
const mockActivities = [
  {
    id: '1',
    type: 'task',
    action: 'created',
    user: { id: '1', name: 'João Silva', email: 'joao@email.com' },
    description: 'Tarefa criada',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    changes: null,
    metadata: null
  },
  {
    id: '2',
    type: 'collaboration',
    action: 'added',
    user: { id: '1', name: 'João Silva', email: 'joao@email.com' },
    description: 'Adicionou Maria Santos como colaboradora',
    createdAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
    changes: null,
    metadata: { 
      collaborator: { id: '2', name: 'Maria Santos' },
      role: 'EDITOR'
    }
  },
  {
    id: '3',
    type: 'assignment',
    action: 'assigned',
    user: { id: '1', name: 'João Silva', email: 'joao@email.com' },
    description: 'Atribuiu a tarefa para Maria Santos',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    changes: null,
    metadata: { 
      assignee: { id: '2', name: 'Maria Santos' }
    }
  },
  {
    id: '4',
    type: 'task',
    action: 'updated',
    user: { id: '2', name: 'Maria Santos', email: 'maria@email.com' },
    description: 'Atualizou a tarefa',
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    changes: {
      status: { from: 'PENDING', to: 'IN_PROGRESS' },
      priority: { from: 'MEDIUM', to: 'HIGH' }
    },
    metadata: null
  },
  {
    id: '5',
    type: 'collaboration',
    action: 'added',
    user: { id: '2', name: 'Maria Santos', email: 'maria@email.com' },
    description: 'Adicionou Pedro Costa como colaborador',
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    changes: null,
    metadata: { 
      collaborator: { id: '3', name: 'Pedro Costa' },
      role: 'VIEWER'
    }
  }
]

// Computed
const filteredActivities = computed(() => {
  if (selectedFilter.value === 'all') {
    return activities.value
  }
  return activities.value.filter(activity => activity.type === selectedFilter.value)
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

const getActivityColor = (type) => {
  const colors = {
    'task': '#6366f1',
    'collaboration': '#10b981',
    'assignment': '#f59e0b',
    'status': '#3b82f6',
    'comments': '#8b5cf6'
  }
  return colors[type] || '#6b7280'
}

const getActivityIcon = (type) => {
  const icons = {
    'task': Edit,
    'collaboration': UserPlus,
    'assignment': Pin,
    'status': CheckCircle,
    'comments': MessageSquare
  }
  return icons[type] || AlertCircle
}

const getActivityAction = (type) => {
  const actions = {
    'task': 'modificou a tarefa',
    'collaboration': 'alterou colaboração',
    'assignment': 'fez atribuição',
    'status': 'atualizou status',
    'comments': 'comentou'
  }
  return actions[type] || 'fez uma ação'
}

const getActivityDescription = (activity) => {
  if (activity.description) {
    return activity.description
  }

  // Generate description based on type and action
  switch (activity.type) {
    case 'task':
      if (activity.action === 'created') return 'Criou a tarefa'
      if (activity.action === 'updated') return 'Atualizou a tarefa'
      if (activity.action === 'deleted') return 'Excluiu a tarefa'
      break
    case 'collaboration':
      if (activity.action === 'added') return `Adicionou ${activity.metadata?.collaborator?.name} como colaborador`
      if (activity.action === 'removed') return `Removeu ${activity.metadata?.collaborator?.name} da colaboração`
      break
    case 'assignment':
      if (activity.action === 'assigned') return `Atribuiu a tarefa para ${activity.metadata?.assignee?.name}`
      if (activity.action === 'unassigned') return 'Removeu a atribuição da tarefa'
      break
  }

  return 'Realizou uma ação na tarefa'
}

const getFieldLabel = (field) => {
  const labels = {
    'title': 'Título',
    'description': 'Descrição',
    'status': 'Status',
    'priority': 'Prioridade',
    'dueDate': 'Data de vencimento',
    'categoryId': 'Categoria'
  }
  return labels[field] || field
}

const formatFieldValue = (field, value) => {
  if (!value) return 'Vazio'

  switch (field) {
    case 'status':
      const statusLabels = {
        'PENDING': 'Pendente',
        'IN_PROGRESS': 'Em Progresso',
        'COMPLETED': 'Concluída',
        'CANCELLED': 'Cancelada'
      }
      return statusLabels[value] || value
    
    case 'priority':
      const priorityLabels = {
        'LOW': 'Baixa',
        'MEDIUM': 'Média',
        'HIGH': 'Alta',
        'URGENT': 'Urgente'
      }
      return priorityLabels[value] || value
    
    case 'dueDate':
      return new Date(value).toLocaleDateString('pt-BR')
    
    default:
      return value
  }
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

const formatRelativeTime = (date) => {
  const now = new Date()
  const past = new Date(date)
  const diffMs = now - past
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffMins < 1) return 'Agora'
  if (diffMins < 60) return `${diffMins}min atrás`
  if (diffHours < 24) return `${diffHours}h atrás`
  if (diffDays < 7) return `${diffDays}d atrás`
  return formatFullDate(date)
}

const formatFullDate = (date) => {
  return new Date(date).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const filterActivities = () => {
  // Reset pagination when filter changes
  page.value = 1
  // In real implementation, would fetch filtered data
}

const refreshActivities = async () => {
  loading.value = true
  // Simulate API call
  setTimeout(() => {
    activities.value = [...mockActivities]
    loading.value = false
  }, 500)
}

const loadMoreActivities = async () => {
  loading.value = true
  page.value += 1
  
  // Simulate API call for more data
  setTimeout(() => {
    // In real implementation, would append new activities
    hasMore.value = false // No more data for demo
    loading.value = false
  }, 500)
}

// Lifecycle
onMounted(() => {
  activities.value = [...mockActivities]
})
</script>
