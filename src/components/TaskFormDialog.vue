<template>
  <BaseDialog
    :is-open="isOpen"
    :title="task ? 'Editar Tarefa' : 'Nova Tarefa'"
    size="lg"
    @close="$emit('close')"
  >
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Title -->
      <BaseFormField
        v-model="form.title"
        label="Título"
        placeholder="Digite o título da tarefa"
        :error="errors.title"
        required
      />

      <!-- Description -->
      <BaseFormField
        v-model="form.description"
        label="Descrição"
        placeholder="Descreva a tarefa (opcional)"
        :error="errors.description"
      >
        <template #default="{ fieldId, hasError }">
          <textarea
            :id="fieldId"
            v-model="form.description"
            rows="3"
            placeholder="Descreva a tarefa (opcional)"
            class="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 resize-none"
            :class="{
              'border-red-300 focus:border-red-500 focus:ring-red-500': hasError
            }"
          ></textarea>
        </template>
      </BaseFormField>

      <!-- Priority and Status Row -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BaseFormField
          v-model="form.priority"
          label="Prioridade"
          :error="errors.priority"
          required
        >
          <template #default="{ fieldId, hasError }">
            <select
              :id="fieldId"
              v-model="form.priority"
              class="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              :class="{
                'border-red-300 focus:border-red-500 focus:ring-red-500': hasError
              }"
            >
              <option value="">Selecione a prioridade</option>
              <option value="LOW">Baixa</option>
              <option value="MEDIUM">Média</option>
              <option value="HIGH">Alta</option>
              <option value="URGENT">Urgente</option>
            </select>
          </template>
        </BaseFormField>

        <BaseFormField
          v-model="form.status"
          label="Status"
          :error="errors.status"
          required
        >
          <template #default="{ fieldId, hasError }">
            <select
              :id="fieldId"
              v-model="form.status"
              class="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              :class="{
                'border-red-300 focus:border-red-500 focus:ring-red-500': hasError
              }"
            >
              <option value="">Selecione o status</option>
              <option value="PENDING">Pendente</option>
              <option value="IN_PROGRESS">Em Andamento</option>
              <option value="COMPLETED">Concluída</option>
              <option value="CANCELLED">Cancelada</option>
            </select>
          </template>
        </BaseFormField>
      </div>

      <!-- Category and Due Date Row -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BaseFormField
          v-model="form.categoryId"
          label="Categoria"
          :error="errors.categoryId"
        >
          <template #default="{ fieldId, hasError }">
            <select
              :id="fieldId"
              v-model="form.categoryId"
              class="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              :class="{
                'border-red-300 focus:border-red-500 focus:ring-red-500': hasError
              }"
            >
              <option value="">Selecione uma categoria (opcional)</option>
              <option
                v-for="category in categoriesStore.categoriesOptions"
                :key="category.value"
                :value="category.value"
              >
                {{ category.label }}
              </option>
            </select>
          </template>
        </BaseFormField>

        <BaseFormField
          v-model="form.dueDate"
          label="Data de Vencimento"
          :error="errors.dueDate"
          type="datetime-local"
        />
      </div>

      <!-- Assignment & Collaboration Section -->
      <div class="border-t border-gray-200 pt-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Users class="h-5 w-5 mr-2 text-purple-600" />
          Atribuição e Colaboração
        </h3>
        
        <div class="space-y-4">
          <!-- Assignee -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Responsável (Assignee)
            </label>
            <UserSearchCombobox
              v-model="selectedAssignee"
              :multiple="false"
              placeholder="Selecionar responsável..."
              :exclude="[authStore.currentUser?.id]"
              @change="handleAssigneeChange"
            />
            <p class="mt-1 text-xs text-gray-500">
              O responsável será notificado e terá a tarefa em sua lista pessoal
            </p>
          </div>

          <!-- Collaborators -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Colaboradores
            </label>
            <UserSearchCombobox
              v-model="selectedCollaborators"
              :multiple="true"
              placeholder="Adicionar colaboradores..."
              :exclude="getExcludedUsers"
              @change="handleCollaboratorsChange"
            />
            
            <!-- Collaboration Preview -->
            <div v-if="collaborationPreview.length > 0" class="mt-3">
              <h4 class="text-sm font-medium text-gray-700 mb-2">Preview da Equipe:</h4>
              <div class="space-y-2">
                <div
                  v-for="collab in collaborationPreview"
                  :key="collab.user.id"
                  class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                >
                  <div class="flex items-center">
                    <div class="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center text-white text-sm font-medium mr-3">
                      {{ getInitials(collab.user.name) }}
                    </div>
                    <div>
                      <div class="text-sm font-medium text-gray-900">{{ collab.user.name }}</div>
                      <div class="text-xs text-gray-500">{{ collab.user.email }}</div>
                    </div>
                  </div>
                  
                  <div class="flex items-center space-x-2">
                    <select
                      v-model="collab.role"
                      @change="updateCollaboratorRole(collab.user.id, collab.role)"
                      class="text-xs border-gray-300 rounded focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="VIEWER">👁️ Visualizador</option>
                      <option value="EDITOR">✏️ Editor</option>
                      <option value="ADMIN">⚙️ Administrador</option>
                    </select>
                    
                    <button
                      @click="removeCollaborator(collab.user.id)"
                      type="button"
                      class="text-red-600 hover:text-red-700"
                    >
                      <X class="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <p class="mt-1 text-xs text-gray-500">
              Colaboradores terão acesso à tarefa baseado no nível de permissão selecionado
            </p>
          </div>
        </div>
      </div>

      <!-- Error Alert -->
      <div v-if="submitError" class="rounded-md bg-red-50 p-4">
        <div class="flex">
          <AlertCircle class="h-5 w-5 text-red-400" />
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">
              Erro ao salvar tarefa
            </h3>
            <div class="mt-2 text-sm text-red-700">
              {{ submitError }}
            </div>
          </div>
        </div>
      </div>
    </form>

    <template #footer>
      <div class="flex justify-end space-x-3">
        <Button
          variant="outline"
          @click="$emit('close')"
          :disabled="loading"
        >
          Cancelar
        </Button>
        <Button
          @click="handleSubmit"
          :loading="loading"
          class="bg-purple-600 hover:bg-purple-700"
        >
          {{ task ? 'Atualizar' : 'Criar' }} Tarefa
        </Button>
      </div>
    </template>
  </BaseDialog>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useTasksStore } from '../stores/tasks.js'
import { useCategoriesStore } from '../stores/categories.js'
import { useAuthStore } from '../stores/auth/auth.js'
import { AlertCircle, Users, X } from 'lucide-vue-next'
import BaseDialog from './ui/BaseDialog.vue'
import BaseFormField from './ui/BaseFormField.vue'
import Button from './ui/Button.vue'
import UserSearchCombobox from './UserSearchCombobox.vue'

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

const emit = defineEmits(['close', 'saved'])

const tasksStore = useTasksStore()
const categoriesStore = useCategoriesStore()
const authStore = useAuthStore()

const loading = ref(false)
const submitError = ref('')

// Collaboration state
const selectedAssignee = ref(null)
const selectedCollaborators = ref([])
const collaborationPreview = ref([])

const form = reactive({
  title: '',
  description: '',
  priority: '',
  status: 'PENDING',
  categoryId: '',
  dueDate: ''
})

const errors = reactive({
  title: '',
  description: '',
  priority: '',
  status: '',
  categoryId: '',
  dueDate: ''
})

// Computed
const getExcludedUsers = computed(() => {
  const excluded = []
  if (selectedAssignee.value) {
    excluded.push(selectedAssignee.value.id)
  }
  if (authStore.currentUser) {
    excluded.push(authStore.currentUser.id)
  }
  return excluded
})

// Reset form and errors
const resetForm = () => {
  Object.assign(form, {
    title: '',
    description: '',
    priority: '',
    status: 'PENDING',
    categoryId: '',
    dueDate: ''
  })
  
  Object.assign(errors, {
    title: '',
    description: '',
    priority: '',
    status: '',
    categoryId: '',
    dueDate: ''
  })
  
  // Reset collaboration
  selectedAssignee.value = null
  selectedCollaborators.value = []
  collaborationPreview.value = []
  submitError.value = ''
}

// Populate form when editing
const populateForm = () => {
  if (props.task) {
    form.title = props.task.title || ''
    form.description = props.task.description || ''
    form.priority = props.task.priority || ''
    form.status = props.task.status || 'PENDING'
    form.categoryId = props.task.categoryId || ''
    
    // Format date for datetime-local input
    if (props.task.dueDate) {
      const date = new Date(props.task.dueDate)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      form.dueDate = `${year}-${month}-${day}T${hours}:${minutes}`
    } else {
      form.dueDate = ''
    }
    
    // Populate collaboration data
    if (props.task.assignee) {
      selectedAssignee.value = props.task.assignee
    }
    
    if (props.task.collaborators) {
      const collabs = props.task.collaborators.filter(c => c.role !== 'OWNER')
      selectedCollaborators.value = collabs.map(c => ({ id: c.id, name: c.name, email: c.email }))
      collaborationPreview.value = collabs.map(c => ({
        user: { id: c.id, name: c.name, email: c.email },
        role: c.role
      }))
    }
  }
}

// Validate form
const validateForm = () => {
  let isValid = true
  
  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })

  // Title validation
  if (!form.title.trim()) {
    errors.title = 'O título é obrigatório'
    isValid = false
  } else if (form.title.length > 100) {
    errors.title = 'O título deve ter no máximo 100 caracteres'
    isValid = false
  }

  // Description validation
  if (form.description && form.description.length > 500) {
    errors.description = 'A descrição deve ter no máximo 500 caracteres'
    isValid = false
  }

  // Priority validation
  if (!form.priority) {
    errors.priority = 'A prioridade é obrigatória'
    isValid = false
  }

  // Status validation
  if (!form.status) {
    errors.status = 'O status é obrigatório'
    isValid = false
  }

  // Due date validation
  if (form.dueDate) {
    const dueDate = new Date(form.dueDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (dueDate < today) {
      errors.dueDate = 'A data de vencimento não pode ser no passado'
      isValid = false
    }
  }

  return isValid
}

// Collaboration functions
const getInitials = (name) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const handleAssigneeChange = (assignee) => {
  selectedAssignee.value = assignee
}

const handleCollaboratorsChange = (collaborators) => {
  selectedCollaborators.value = collaborators
  updateCollaborationPreview()
}

const updateCollaborationPreview = () => {
  collaborationPreview.value = selectedCollaborators.value.map(user => {
    const existing = collaborationPreview.value.find(c => c.user.id === user.id)
    return {
      user,
      role: existing?.role || 'VIEWER'
    }
  })
}

const updateCollaboratorRole = (userId, role) => {
  const collaboration = collaborationPreview.value.find(c => c.user.id === userId)
  if (collaboration) {
    collaboration.role = role
  }
}

const removeCollaborator = (userId) => {
  selectedCollaborators.value = selectedCollaborators.value.filter(u => u.id !== userId)
  collaborationPreview.value = collaborationPreview.value.filter(c => c.user.id !== userId)
}

// Submit form
const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  try {
    loading.value = true
    submitError.value = ''

    const taskData = {
      title: form.title.trim(),
      description: form.description.trim(),
      priority: form.priority,
      status: form.status,
      categoryId: form.categoryId || null,
      dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null,
      assigneeId: selectedAssignee.value?.id || null,
      collaborators: collaborationPreview.value.map(c => ({
        userId: c.user.id,
        role: c.role
      }))
    }

    if (props.task) {
      await tasksStore.updateTask(props.task.id, taskData)
    } else {
      await tasksStore.createTask(taskData)
    }

    emit('saved')
  } catch (error) {
    submitError.value = error.message || 'Erro ao salvar tarefa'
  } finally {
    loading.value = false
  }
}

// Watch for dialog open/close and task changes
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    if (props.task) {
      populateForm()
    } else {
      resetForm()
    }
  }
})

watch(() => props.task, () => {
  if (props.isOpen) {
    if (props.task) {
      populateForm()
    } else {
      resetForm()
    }
  }
})
</script>
