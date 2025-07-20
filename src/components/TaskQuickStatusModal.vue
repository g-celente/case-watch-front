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
        class="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white shadow-xl transition-all"
      >
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 class="text-lg font-semibold text-gray-900">Alterar Status</h2>
          <button
            @click="$emit('close')"
            class="rounded-md p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <X class="h-5 w-5" />
          </button>
        </div>

        <!-- Content -->
        <div v-if="task" class="px-6 py-4">
          <!-- Task Info -->
          <div class="mb-6">
            <h3 class="text-lg font-medium text-gray-900 mb-2">{{ task.title }}</h3>
            <div class="flex items-center space-x-4 text-sm text-gray-500">
              <span :class="getPriorityClass(task.priority)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                {{ getPriorityLabel(task.priority) }}
              </span>
              <span v-if="task.dueDate" :class="getDueDateClass(task.dueDate)" class="font-medium">
                Vence: {{ formatDate(task.dueDate) }}
              </span>
            </div>
          </div>

          <!-- Status Options -->
          <div class="space-y-3">
            <h4 class="text-sm font-medium text-gray-700">Selecione o novo status:</h4>
            
            <div class="grid grid-cols-1 gap-2">
              <button
                v-for="status in statusOptions"
                :key="status.value"
                @click="updateStatus(status.value)"
                :disabled="status.value === task.status || loading"
                class="flex items-center justify-between p-3 border rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                :class="[
                  status.value === task.status
                    ? 'border-purple-300 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                ]"
              >
                <div class="flex items-center">
                  <component :is="status.icon" :class="status.iconClass" class="h-5 w-5 mr-3" />
                  <div class="text-left">
                    <div class="font-medium text-gray-900">{{ status.label }}</div>
                    <div class="text-xs text-gray-500">{{ status.description }}</div>
                  </div>
                </div>
                
                <div v-if="status.value === task.status" class="flex items-center text-purple-600">
                  <CheckCircle class="h-4 w-4" />
                </div>
              </button>
            </div>
          </div>

          <!-- Progress Indicator -->
          <div v-if="loading" class="mt-4 text-center">
            <div class="inline-flex items-center">
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 mr-2"></div>
              <span class="text-sm text-gray-600">Atualizando...</span>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="border-t border-gray-200 px-6 py-4 flex justify-end space-x-3">
          <button
            @click="$emit('close')"
            :disabled="loading"
            class="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
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
  Clock, 
  Play, 
  CheckSquare
} from 'lucide-vue-next'
import { useTasksStore } from '../stores/tasks.js'
import { useToast } from '../composables/useToast.js'

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
const { showToast } = useToast()

// State
const modalContent = ref(null)
const loading = ref(false)

// Computed
const statusOptions = computed(() => [
  {
    value: 'PENDING',
    label: 'Pendente',
    description: 'Tarefa ainda não iniciada',
    icon: Clock,
    iconClass: 'text-yellow-500'
  },
  {
    value: 'IN_PROGRESS',
    label: 'Em Progresso',
    description: 'Tarefa sendo executada',
    icon: Play,
    iconClass: 'text-blue-500'
  },
  {
    value: 'COMPLETED',
    label: 'Concluída',
    description: 'Tarefa finalizada',
    icon: CheckSquare,
    iconClass: 'text-green-500'
  }
])

// Methods
const handleBackdropClick = (event) => {
  if (modalContent.value && !modalContent.value.contains(event.target)) {
    emit('close')
  }
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

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const updateStatus = async (newStatus) => {
  if (!props.task || newStatus === props.task.status) return
  
  try {
    loading.value = true
    await tasksStore.updateTaskStatus(props.task.id, newStatus)
    
    showToast('Status atualizado com sucesso!', 'success')
    emit('updated')
    emit('close')
  } catch (error) {
    showToast('Erro ao atualizar status da tarefa', 'error')
  } finally {
    loading.value = false
  }
}
</script>
