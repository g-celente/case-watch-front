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
              <option value="low">Baixa</option>
              <option value="medium">Média</option>
              <option value="high">Alta</option>
              <option value="urgent">Urgente</option>
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
              <option value="pending">Pendente</option>
              <option value="in_progress">Em Andamento</option>
              <option value="completed">Concluída</option>
              <option value="cancelled">Cancelada</option>
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
import { AlertCircle } from 'lucide-vue-next'
import BaseDialog from './ui/BaseDialog.vue'
import BaseFormField from './ui/BaseFormField.vue'
import Button from './ui/Button.vue'

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

const loading = ref(false)
const submitError = ref('')

const form = reactive({
  title: '',
  description: '',
  priority: '',
  status: 'pending',
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

// Reset form and errors
const resetForm = () => {
  Object.assign(form, {
    title: '',
    description: '',
    priority: '',
    status: 'pending',
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
  
  submitError.value = ''
}

// Populate form when editing
const populateForm = () => {
  if (props.task) {
    form.title = props.task.title || ''
    form.description = props.task.description || ''
    form.priority = props.task.priority || ''
    form.status = props.task.status || 'pending'
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
      dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null
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
