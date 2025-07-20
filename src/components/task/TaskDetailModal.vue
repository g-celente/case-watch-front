<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 overflow-y-auto"
    @click="handleBackdropClick"
  >
    <div class="flex min-h-screen items-center justify-center p-4">
      <div class="fixed inset-0 bg-black bg-opacity-25 transition-opacity"></div>
      
      <div
        ref="modalContent"
        class="relative w-full max-w-4xl transform overflow-hidden rounded-lg bg-white shadow-xl transition-all"
      >
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 class="text-lg font-semibold text-gray-900">Detalhes da Tarefa</h2>
          <button
            @click="$emit('close')"
            class="rounded-md p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <X class="h-5 w-5" />
          </button>
        </div>

        <!-- Content -->
        <div v-if="task" class="px-6 py-4">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Main Content -->
            <div class="lg:col-span-2 space-y-6">
              <!-- Title and Description -->
              <div>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ task.title }}</h3>
                <p v-if="task.description" class="text-gray-600 whitespace-pre-wrap">{{ task.description }}</p>
                <p v-else class="text-gray-400 italic">Sem descrição</p>
              </div>

              <!-- Status and Priority -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    :value="task.status"
                    @change="updateStatus($event.target.value)"
                    :disabled="!canEdit"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                  >
                    <option value="PENDING">Pendente</option>
                    <option value="IN_PROGRESS">Em Progresso</option>
                    <option value="COMPLETED">Concluída</option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Prioridade</label>
                  <span :class="getPriorityClass(task.priority)" class="inline-flex px-3 py-2 text-sm font-semibold rounded-md w-full justify-center">
                    {{ getPriorityLabel(task.priority) }}
                  </span>
                </div>
              </div>

              <!-- Dates -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Data de Criação</label>
                  <p class="text-sm text-gray-600">{{ formatDateTime(task.createdAt) }}</p>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Prazo de Entrega</label>
                  <p v-if="task.dueDate" :class="getDueDateClass(task.dueDate)" class="text-sm font-medium">
                    {{ formatDateTime(task.dueDate) }}
                  </p>
                  <p v-else class="text-sm text-gray-400">Sem prazo definido</p>
                </div>
              </div>

              <!-- Category -->
              <div v-if="task.category">
                <label class="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                <span
                  class="inline-flex px-3 py-1 text-sm font-semibold rounded-full"
                  :style="{ backgroundColor: task.category.color + '20', color: task.category.color }"
                >
                  {{ task.category.name }}
                </span>
              </div>

              <!-- Owner -->
              <div v-if="task.owner">
                <label class="block text-sm font-medium text-gray-700 mb-1">Criador da Tarefa</label>
                <div class="flex items-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <div
                    class="h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-medium mr-3"
                  >
                    {{ getInitials(task.owner.name) }}
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ task.owner.name }}</p>
                    <p class="text-xs text-gray-500">{{ task.owner.email }}</p>
                    <p class="text-xs text-purple-600 mt-1">👑 Proprietário da tarefa</p>
                  </div>
                </div>
              </div>

              <!-- Assignee -->
              <div v-if="task.assignee">
                <label class="block text-sm font-medium text-gray-700 mb-1">Responsável Principal</label>
                <div class="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div
                    class="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium mr-3"
                  >
                    {{ getInitials(task.assignee.name) }}
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ task.assignee.name }}</p>
                    <p class="text-xs text-gray-500">{{ task.assignee.email }}</p>
                    <p class="text-xs text-blue-600 mt-1">📋 Responsável pela tarefa</p>
                  </div>
                </div>
              </div>

              <!-- Progress -->
              <div v-if="task.status === 'IN_PROGRESS'">
                <label class="block text-sm font-medium text-gray-700 mb-1">Progresso</label>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div
                    class="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    :style="{ width: getProgressPercentage(task) + '%' }"
                  ></div>
                </div>
                <p class="text-xs text-gray-500 mt-1">{{ getProgressPercentage(task) }}% concluído</p>
              </div>

              <!-- Collaborators Section -->
              <div v-if="task.collaborators && task.collaborators.length > 0">
                <h4 class="text-lg font-medium text-gray-900 mb-4">Equipe de Colaboração</h4>
                
                <!-- Collaborators List -->
                <div class="space-y-3">
                  <div
                    v-for="collaborator in task.collaborators"
                    :key="collaborator.id"
                    class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                  >
                    <div class="flex items-center">
                      <div 
                        class="h-10 w-10 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3"
                        :class="getCollaboratorAvatarClass(collaborator.role)"
                      >
                        {{ getInitials(collaborator.name) }}
                      </div>
                      <div>
                        <div class="text-sm font-medium text-gray-900">
                          {{ collaborator.name }}
                          <span v-if="collaborator.id === task.assignee?.id" class="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            Responsável
                          </span>
                        </div>
                        <div class="text-xs text-gray-500">{{ collaborator.email }}</div>
                      </div>
                    </div>
                    
                    <div class="flex items-center space-x-2">
                      <span 
                        :class="getRoleBadgeClass(collaborator.role)" 
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      >
                        {{ getRoleIcon(collaborator.role) }} {{ getRoleLabel(collaborator.role) }}
                      </span>
                    </div>
                  </div>
                </div>
                
                <!-- Permission Summary -->
                <div class="mt-4 p-3 bg-blue-50 rounded-lg">
                  <h5 class="text-sm font-medium text-blue-900 mb-2">Seus Privilégios</h5>
                  <div class="flex flex-wrap gap-2">
                    <span v-if="canEdit" class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                      <CheckCircle class="h-3 w-3 mr-1" />
                      Pode editar
                    </span>
                    <span v-if="canDelete" class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                      <X class="h-3 w-3 mr-1" />
                      Pode excluir
                    </span>
                    <span v-if="canManageCollaborators" class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                      <Users class="h-3 w-3 mr-1" />
                      Gerenciar colaboradores
                    </span>
                    <span v-if="!canEdit" class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                      <Eye class="h-3 w-3 mr-1" />
                      Apenas visualizar
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h4 class="text-lg font-medium text-gray-900 mb-4">Comentários</h4>
                
                <!-- Add Comment -->
                <div class="mb-4">
                  <textarea
                    v-model="newComment"
                    placeholder="Adicionar um comentário..."
                    rows="3"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-purple-500 focus:border-purple-500"
                  ></textarea>
                  <div class="mt-2 flex justify-end">
                    <button
                      @click="addComment"
                      :disabled="!newComment.trim()"
                      class="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Comentar
                    </button>
                  </div>
                </div>

                <!-- Comments List -->
                <div class="space-y-3">
                  <div
                    v-for="comment in task.comments || []"
                    :key="comment.id"
                    class="flex space-x-3"
                  >
                    <div
                      class="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600 flex-shrink-0"
                    >
                      {{ getInitials(comment.author?.name || 'U') }}
                    </div>
                    <div class="flex-1 bg-gray-50 rounded-lg p-3">
                      <div class="flex items-center justify-between mb-1">
                        <h5 class="text-sm font-medium text-gray-900">{{ comment.author?.name || 'Usuário' }}</h5>
                        <span class="text-xs text-gray-500">{{ formatDateTime(comment.createdAt) }}</span>
                      </div>
                      <p class="text-sm text-gray-700">{{ comment.content }}</p>
                    </div>
                  </div>
                  
                  <div v-if="!task.comments?.length" class="text-center py-6">
                    <MessageSquare class="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p class="text-sm text-gray-500">Nenhum comentário ainda</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Sidebar -->
            <div class="space-y-6">
              <!-- Team Summary -->
              <div v-if="task.collaborators && task.collaborators.length > 0" class="bg-gray-50 rounded-lg p-4">
                <h4 class="font-medium text-gray-900 mb-3">Resumo da Equipe</h4>
                <div class="space-y-2">
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-600">Total de membros:</span>
                    <span class="font-medium">{{ task.collaborators.length }}</span>
                  </div>
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-600">Seu papel:</span>
                    <span :class="getRoleBadgeClass(currentUserRole)" class="px-2 py-1 rounded-full text-xs font-medium">
                      {{ getRoleIcon(currentUserRole) }} {{ getRoleLabel(currentUserRole) }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Quick Actions -->
              <div class="bg-gray-50 rounded-lg p-4">
                <h4 class="font-medium text-gray-900 mb-3">Ações Rápidas</h4>
                <div class="space-y-2">
                  <button
                    v-if="task.status !== 'COMPLETED'"
                    @click="markAsCompleted"
                    class="w-full flex items-center justify-center px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700"
                  >
                    <CheckCircle class="h-4 w-4 mr-2" />
                    Marcar como Concluída
                  </button>
                  
                  <button
                    v-if="task.status === 'PENDING'"
                    @click="startProgress"
                    class="w-full flex items-center justify-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                  >
                    <Play class="h-4 w-4 mr-2" />
                    Iniciar Progresso
                  </button>
                  
                  <button
                    @click="openEditModal"
                    :disabled="!canEdit"
                    class="w-full flex items-center justify-center px-3 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    <Edit3 class="h-4 w-4 mr-2" />
                    Editar Tarefa
                  </button>
                </div>
              </div>

              <!-- Task Timeline -->
              <div class="bg-gray-50 rounded-lg p-4">
                <h4 class="font-medium text-gray-900 mb-3">Timeline</h4>
                <div class="space-y-3">
                  <div class="flex items-start space-x-3">
                    <div class="h-2 w-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p class="text-sm font-medium text-gray-900">Tarefa criada</p>
                      <p class="text-xs text-gray-500">{{ formatDateTime(task.createdAt) }}</p>
                    </div>
                  </div>
                  
                  <div v-if="task.status !== 'PENDING'" class="flex items-start space-x-3">
                    <div class="h-2 w-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p class="text-sm font-medium text-gray-900">Progresso iniciado</p>
                      <p class="text-xs text-gray-500">{{ formatDateTime(task.updatedAt) }}</p>
                    </div>
                  </div>
                  
                  <div v-if="task.status === 'COMPLETED'" class="flex items-start space-x-3">
                    <div class="h-2 w-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p class="text-sm font-medium text-gray-900">Tarefa concluída</p>
                      <p class="text-xs text-gray-500">{{ formatDateTime(task.updatedAt) }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="border-t border-gray-200 px-6 py-4 flex justify-end space-x-3">
          <button
            @click="$emit('close')"
            class="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { 
  X, 
  CheckCircle, 
  Play, 
  Edit3, 
  MessageSquare,
  Users,
  Eye
} from 'lucide-vue-next'
import { useTasksStore } from '../../stores/tasks.js'
import { useAuthStore } from '../../stores/auth/auth.js'
import { useToast } from '../../composables/useToast.js'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  task: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'updated'])

const tasksStore = useTasksStore()
const authStore = useAuthStore()
const { showToast } = useToast()

// State
const modalContent = ref(null)
const newComment = ref('')

// Computed
const canEdit = computed(() => {
  if (!props.task || !authStore.currentUser) return false
  
  const userRole = currentUserRole.value
  
  // User can edit if they are the assignee, owner, admin, or editor
  return props.task.assignee?.id === authStore.currentUser.id ||
         ['OWNER', 'ADMIN', 'EDITOR'].includes(userRole)
})

const canDelete = computed(() => {
  if (!props.task || !authStore.currentUser) return false
  
  const userRole = currentUserRole.value
  return ['OWNER', 'ADMIN'].includes(userRole)
})

const canManageCollaborators = computed(() => {
  if (!props.task || !authStore.currentUser) return false
  
  const userRole = currentUserRole.value
  return ['OWNER', 'ADMIN'].includes(userRole)
})

const currentUserRole = computed(() => {
  if (!props.task || !authStore.currentUser) return null
  
  // Check if user is the owner
  if (props.task.owner?.id === authStore.currentUser.id) return 'OWNER'
  
  // Check if user is in collaborators
  const collaborator = props.task.collaborators?.find(c => c.id === authStore.currentUser.id)
  return collaborator?.role || 'VIEWER'
})

// Methods
const handleBackdropClick = (event) => {
  if (modalContent.value && !modalContent.value.contains(event.target)) {
    emit('close')
  }
}

const getInitials = (name) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const getCollaboratorAvatarClass = (role) => {
  const classes = {
    'OWNER': 'bg-purple-600',
    'ADMIN': 'bg-red-600',
    'EDITOR': 'bg-blue-600',
    'VIEWER': 'bg-gray-600'
  }
  return classes[role] || 'bg-gray-600'
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
  
  if (diffDays < 0) return 'text-red-600'
  if (diffDays <= 1) return 'text-orange-600'
  if (diffDays <= 3) return 'text-yellow-600'
  return 'text-gray-600'
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

const getProgressPercentage = (task) => {
  // Simple progress calculation based on status
  if (task.status === 'PENDING') return 0
  if (task.status === 'IN_PROGRESS') return 50
  if (task.status === 'COMPLETED') return 100
  return 0
}

const updateStatus = async (newStatus) => {
  if (!canEdit.value) return
  
  try {
    await tasksStore.updateTaskStatus(props.task.id, newStatus)
    showToast('Status atualizado com sucesso!', 'success')
    emit('updated')
  } catch (error) {
    showToast('Erro ao atualizar status', 'error')
  }
}

const markAsCompleted = async () => {
  if (confirm('Marcar esta tarefa como concluída?')) {
    await updateStatus('COMPLETED')
  }
}

const startProgress = async () => {
  await updateStatus('IN_PROGRESS')
}

const openEditModal = () => {
  showToast('Funcionalidade de edição será implementada em breve', 'info')
}

const addComment = async () => {
  if (!newComment.value.trim()) return
  
  try {
    const comment = {
      id: Date.now(),
      content: newComment.value.trim(),
      author: authStore.currentUser,
      createdAt: new Date().toISOString()
    }
    
    // Add comment to task (this would normally be an API call)
    if (!props.task.comments) {
      props.task.comments = []
    }
    props.task.comments.push(comment)
    
    newComment.value = ''
    showToast('Comentário adicionado com sucesso!', 'success')
    emit('updated')
  } catch (error) {
    showToast('Erro ao adicionar comentário', 'error')
  }
}
</script>
