<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6 transition-all duration-300 hov<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { Edit, AlertCircle } from 'lucide-vue-next'

const authStore = useAuthStore()
const user = computed(() => authStore.user)
const isSubmitting = computed(() => authStore.isUpdatingProfile)ow-md">
    <h2 class="text-lg font-medium text-gray-900 mb-5 flex items-center">
      <Edit class="w-5 h-5 mr-2 text-purple-500" />
      Editar Perfil
    </h2>
    
    <form @submit.prevent="handleSubmit" class="space-y-5">
      <!-- Nome -->
      <div class="space-y-2">
        <label for="name" class="block text-sm font-medium text-gray-700">Nome</label>
        <input 
          id="name" 
          v-model="formData.name" 
          type="text" 
          class="w-full px-4 py-2.5 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
          :class="{ 'border-red-500 ring-red-200': errors.name }"
        />
        <p v-if="errors.name" class="mt-1 text-sm text-red-600 flex items-center">
          <AlertCircle class="w-3.5 h-3.5 mr-1" />
          {{ errors.name }}
        </p>
      </div>
      
      <!-- E-mail -->
      <div class="space-y-2">
        <label for="email" class="block text-sm font-medium text-gray-700">E-mail</label>
        <input 
          id="email" 
          v-model="formData.email" 
          type="email" 
          class="w-full px-4 py-2.5 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
          :class="{ 'border-red-500 ring-red-200': errors.email }"
        />
        <p v-if="errors.email" class="mt-1 text-sm text-red-600 flex items-center">
          <AlertCircle class="w-3.5 h-3.5 mr-1" />
          {{ errors.email }}
        </p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <!-- Cargo -->
        <div class="space-y-2">
          <label for="jobTitle" class="block text-sm font-medium text-gray-700">Cargo</label>
          <input 
            id="jobTitle" 
            v-model="formData.jobTitle" 
            type="text" 
            class="w-full px-4 py-2.5 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
            :class="{ 'border-red-500 ring-red-200': errors.jobTitle }"
          />
          <p v-if="errors.jobTitle" class="mt-1 text-sm text-red-600 flex items-center">
            <AlertCircle class="w-3.5 h-3.5 mr-1" />
            {{ errors.jobTitle }}
          </p>
        </div>
        
        <!-- Departamento -->
        <div class="space-y-2">
          <label for="department" class="block text-sm font-medium text-gray-700">Departamento</label>
          <input 
            id="department" 
            v-model="formData.department" 
            type="text" 
            class="w-full px-4 py-2.5 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
            :class="{ 'border-red-500 ring-red-200': errors.department }"
          />
          <p v-if="errors.department" class="mt-1 text-sm text-red-600 flex items-center">
            <AlertCircle class="w-3.5 h-3.5 mr-1" />
            {{ errors.department }}
          </p>
        </div>
      </div>
      
      <!-- Bio -->
      <div class="space-y-2">
        <label for="bio" class="block text-sm font-medium text-gray-700">Sobre mim</label>
        <textarea 
          id="bio" 
          v-model="formData.bio" 
          rows="4" 
          class="w-full px-4 py-2.5 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
          :class="{ 'border-red-500 ring-red-200': errors.bio }"
        ></textarea>
        <p v-if="errors.bio" class="mt-1 text-sm text-red-600 flex items-center">
          <AlertCircle class="w-3.5 h-3.5 mr-1" />
          {{ errors.bio }}
        </p>
      </div>
      
      <!-- Botões -->
      <div class="flex justify-end space-x-4 pt-5">
        <button 
          type="button" 
          @click="resetForm" 
          class="px-5 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          :disabled="isSubmitting"
        >
          Cancelar
        </button>
        <button 
          type="submit" 
          class="px-5 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          :disabled="isSubmitting"
        >
          <div v-if="isSubmitting" class="flex items-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Salvando...
          </div>
          <span v-else>Salvar Alterações</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '../../stores/auth/auth.js'

const authStore = useAuthStore()
const user = computed(() => authStore.user)
const isSubmitting = computed(() => authStore.isUpdatingProfile)

const formData = reactive({
  name: '',
  email: '',
  jobTitle: '',
  department: '',
  bio: ''
})

const errors = reactive({
  name: '',
  email: '',
  jobTitle: '',
  department: '',
  bio: ''
})

// Inicializar formulário com dados do usuário
onMounted(() => {
  resetForm()
})

// Atualizar o formulário se os dados do usuário mudarem
watch(() => user.value, (newUser) => {
  if (newUser) {
    resetForm()
  }
}, { deep: true })

const resetForm = () => {
  if (user.value) {
    formData.name = user.value.name || ''
    formData.email = user.value.email || ''
    formData.jobTitle = user.value.jobTitle || ''
    formData.department = user.value.department || ''
    formData.bio = user.value.bio || ''
  }
  
  // Limpar erros
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })
}

const validate = () => {
  let isValid = true
  
  // Limpar erros anteriores
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })
  
  // Validar nome
  if (!formData.name.trim()) {
    errors.name = 'O nome é obrigatório'
    isValid = false
  }
  
  // Validar e-mail
  if (!formData.email.trim()) {
    errors.email = 'O e-mail é obrigatório'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'E-mail inválido'
    isValid = false
  }
  
  return isValid
}

const handleSubmit = async () => {
  if (!validate()) return
  
  try {
    await authStore.updateUserProfile({
      name: formData.name,
      email: formData.email,
      jobTitle: formData.jobTitle,
      department: formData.department,
      bio: formData.bio
    })
  } catch (error) {
    // Tratar erros específicos da API se necessário
    if (error.response?.data?.errors) {
      const apiErrors = error.response.data.errors
      Object.keys(apiErrors).forEach(key => {
        if (errors.hasOwnProperty(key)) {
          errors[key] = apiErrors[key]
        }
      })
    }
  }
}
</script>
