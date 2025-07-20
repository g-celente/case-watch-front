<template>
  <BaseDialog
    :is-open="isOpen"
    :title="category ? 'Editar Categoria' : 'Nova Categoria'"
    size="md"
    @close="$emit('close')"
  >
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Name -->
      <BaseFormField
        v-model="form.name"
        label="Nome"
        placeholder="Digite o nome da categoria"
        :error="errors.name"
        required
      />

      <!-- Description -->
      <BaseFormField
        v-model="form.description"
        label="Descrição"
        placeholder="Descreva a categoria (opcional)"
        :error="errors.description"
      >
        <template #default="{ fieldId, hasError }">
          <textarea
            :id="fieldId"
            v-model="form.description"
            rows="3"
            placeholder="Descreva a categoria (opcional)"
            class="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 resize-none"
            :class="{
              'border-red-300 focus:border-red-500 focus:ring-red-500': hasError
            }"
          ></textarea>
        </template>
      </BaseFormField>

      <!-- Color -->
      <BaseFormField
        v-model="form.color"
        label="Cor"
        :error="errors.color"
        required
      >
        <template #default="{ fieldId, hasError }">
          <div class="space-y-3">
            <!-- Color Input -->
            <div class="flex items-center space-x-3">
              <input
                :id="fieldId"
                v-model="form.color"
                type="color"
                class="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                :class="{
                  'border-red-300': hasError
                }"
              />
              <input
                v-model="form.color"
                type="text"
                placeholder="#000000"
                class="flex-1 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                :class="{
                  'border-red-300 focus:border-red-500 focus:ring-red-500': hasError
                }"
              />
            </div>
            
            <!-- Predefined Colors -->
            <div class="grid grid-cols-8 gap-2">
              <button
                v-for="color in predefinedColors"
                :key="color"
                type="button"
                class="w-8 h-8 rounded-full border-2 border-gray-200 hover:border-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                :class="{
                  'border-purple-500 ring-2 ring-purple-200': form.color === color
                }"
                :style="{ backgroundColor: color }"
                @click="form.color = color"
              ></button>
            </div>
            
            <!-- Preview -->
            <div class="flex items-center p-3 rounded-lg border border-gray-200">
              <div
                class="w-6 h-6 rounded-full mr-3"
                :style="{ backgroundColor: form.color }"
              ></div>
              <span class="text-sm text-gray-600">
                Preview da cor selecionada
              </span>
            </div>
          </div>
        </template>
      </BaseFormField>

      <!-- Error Alert -->
      <div v-if="submitError" class="rounded-md bg-red-50 p-4">
        <div class="flex">
          <AlertCircle class="h-5 w-5 text-red-400" />
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">
              Erro ao salvar categoria
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
          {{ category ? 'Atualizar' : 'Criar' }} Categoria
        </Button>
      </div>
    </template>
  </BaseDialog>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
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
  category: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'saved'])

const categoriesStore = useCategoriesStore()

const loading = ref(false)
const submitError = ref('')

const form = reactive({
  name: '',
  description: '',
  color: '#6366f1'
})

const errors = reactive({
  name: '',
  description: '',
  color: ''
})

// Predefined colors
const predefinedColors = [
  '#6366f1', // purple
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // yellow
  '#ef4444', // red
  '#8b5cf6', // violet
  '#06b6d4', // cyan
  '#84cc16', // lime
  '#f97316', // orange
  '#ec4899', // pink
  '#6b7280', // gray
  '#1f2937'  // dark gray
]

// Reset form and errors
const resetForm = () => {
  Object.assign(form, {
    name: '',
    description: '',
    color: '#6366f1'
  })
  
  Object.assign(errors, {
    name: '',
    description: '',
    color: ''
  })
  
  submitError.value = ''
}

// Populate form when editing
const populateForm = () => {
  if (props.category) {
    form.name = props.category.name || ''
    form.description = props.category.description || ''
    form.color = props.category.color || '#6366f1'
  }
}

// Validate form
const validateForm = () => {
  let isValid = true
  
  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })

  // Name validation
  if (!form.name.trim()) {
    errors.name = 'O nome é obrigatório'
    isValid = false
  } else if (form.name.length > 50) {
    errors.name = 'O nome deve ter no máximo 50 caracteres'
    isValid = false
  }

  // Description validation
  if (form.description && form.description.length > 200) {
    errors.description = 'A descrição deve ter no máximo 200 caracteres'
    isValid = false
  }

  // Color validation
  if (!form.color) {
    errors.color = 'A cor é obrigatória'
    isValid = false
  } else if (!/^#[0-9A-F]{6}$/i.test(form.color)) {
    errors.color = 'Cor deve estar no formato hexadecimal (#000000)'
    isValid = false
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

    const categoryData = {
      name: form.name.trim(),
      description: form.description.trim(),
      color: form.color
    }

    if (props.category) {
      await categoriesStore.updateCategory(props.category.id, categoryData)
    } else {
      await categoriesStore.createCategory(categoryData)
    }

    emit('saved')
  } catch (error) {
    submitError.value = error.message || 'Erro ao salvar categoria'
  } finally {
    loading.value = false
  }
}

// Watch for dialog open/close and category changes
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    if (props.category) {
      populateForm()
    } else {
      resetForm()
    }
  }
})

watch(() => props.category, () => {
  if (props.isOpen) {
    if (props.category) {
      populateForm()
    } else {
      resetForm()
    }
  }
})
</script>
