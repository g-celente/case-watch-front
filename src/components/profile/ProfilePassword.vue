<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6 transition-all duration-300 hover:shadow-md">
    <h2 class="text-lg font-medium text-gray-900 mb-5 flex items-center">
      <Lock class="w-5 h-5 mr-2 text-purple-500" />
      Alterar Senha
    </h2>
    
    <form @submit.prevent="handleSubmit" class="space-y-5">
      <!-- Senha atual -->
      <div class="space-y-2">
        <label for="currentPassword" class="block text-sm font-medium text-gray-700">Senha Atual</label>
        <div class="relative">
          <input 
            id="currentPassword" 
            v-model="formData.currentPassword" 
            :type="showCurrentPassword ? 'text' : 'password'" 
            class="w-full px-4 py-2.5 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
            :class="{ 'border-red-500 ring-red-200': errors.currentPassword }"
          />
          <button 
            type="button"
            @click="showCurrentPassword = !showCurrentPassword"
            class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <Eye v-if="!showCurrentPassword" class="h-5 w-5" />
            <EyeOff v-else class="h-5 w-5" />
          </button>
        </div>
        <p v-if="errors.currentPassword" class="mt-1 text-sm text-red-600 flex items-center">
          <AlertCircle class="w-3.5 h-3.5 mr-1" />
          {{ errors.currentPassword }}
        </p>
      </div>
      
      <!-- Nova senha -->
      <div class="space-y-2">
        <label for="newPassword" class="block text-sm font-medium text-gray-700">Nova Senha</label>
        <div class="relative">
          <input 
            id="newPassword" 
            v-model="formData.newPassword" 
            :type="showNewPassword ? 'text' : 'password'" 
            class="w-full px-4 py-2.5 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
            :class="{ 'border-red-500 ring-red-200': errors.newPassword }"
          />
          <button 
            type="button"
            @click="showNewPassword = !showNewPassword"
            class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <Eye v-if="!showNewPassword" class="h-5 w-5" />
            <EyeOff v-else class="h-5 w-5" />
          </button>
        </div>
        <p v-if="errors.newPassword" class="mt-1 text-sm text-red-600 flex items-center">
          <AlertCircle class="w-3.5 h-3.5 mr-1" />
          {{ errors.newPassword }}
        </p>
      </div>
      
      <!-- Confirmar nova senha -->
      <div class="space-y-2">
        <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirmar Nova Senha</label>
        <div class="relative">
          <input 
            id="confirmPassword" 
            v-model="formData.confirmPassword" 
            :type="showConfirmPassword ? 'text' : 'password'" 
            class="w-full px-4 py-2.5 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
            :class="{ 'border-red-500 ring-red-200': errors.confirmPassword }"
          />
          <button 
            type="button"
            @click="showConfirmPassword = !showConfirmPassword"
            class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <Eye v-if="!showConfirmPassword" class="h-5 w-5" />
            <EyeOff v-else class="h-5 w-5" />
          </button>
        </div>
        <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-600 flex items-center">
          <AlertCircle class="w-3.5 h-3.5 mr-1" />
          {{ errors.confirmPassword }}
        </p>
      </div>
      
      <!-- Requisitos de senha -->
      <div class="bg-gray-50 p-5 rounded-lg border border-gray-100">
        <h3 class="text-sm font-medium text-gray-700 mb-3 flex items-center">
          <Shield class="w-4 h-4 mr-1.5 text-gray-500" />
          A senha deve conter:
        </h3>
        <ul class="space-y-2 text-sm">
          <li class="flex items-center">
            <span 
              class="flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center mr-2 transition-colors duration-200"
              :class="passwordStrength.minLength ? 'text-green-500' : 'text-gray-400'"
            >
              <CheckCircle v-if="passwordStrength.minLength" class="h-4 w-4" />
              <Circle v-else class="h-4 w-4" />
            </span>
            No mínimo 8 caracteres
          </li>
          <li class="flex items-center">
            <span 
              class="flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center mr-2 transition-colors duration-200"
              :class="passwordStrength.hasUppercase ? 'text-green-500' : 'text-gray-400'"
            >
              <CheckCircle v-if="passwordStrength.hasUppercase" class="h-4 w-4" />
              <Circle v-else class="h-4 w-4" />
            </span>
            Pelo menos uma letra maiúscula
          </li>
          <li class="flex items-center">
            <span 
              class="flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center mr-2 transition-colors duration-200"
              :class="passwordStrength.hasLowercase ? 'text-green-500' : 'text-gray-400'"
            >
              <CheckCircle v-if="passwordStrength.hasLowercase" class="h-4 w-4" />
              <Circle v-else class="h-4 w-4" />
            </span>
            Pelo menos uma letra minúscula
          </li>
          <li class="flex items-center">
            <span 
              class="flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center mr-2 transition-colors duration-200"
              :class="passwordStrength.hasNumber ? 'text-green-500' : 'text-gray-400'"
            >
              <CheckCircle v-if="passwordStrength.hasNumber" class="h-4 w-4" />
              <Circle v-else class="h-4 w-4" />
            </span>
            Pelo menos um número
          </li>
        </ul>
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
          class="px-5 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-70 disabled:cursor-not-allowed"
          :disabled="isSubmitting || !isPasswordValid"
        >
          <div v-if="isSubmitting" class="flex items-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Alterando...
          </div>
          <span v-else>Alterar Senha</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useAuthStore } from '../../stores/auth/auth.js'
import { Eye, EyeOff, CheckCircle, Circle, Lock, Shield, AlertCircle } from 'lucide-vue-next'

const authStore = useAuthStore()
const isSubmitting = ref(false)

const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const formData = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const errors = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const passwordStrength = computed(() => {
  const password = formData.newPassword
  return {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password)
  }
})

const isPasswordValid = computed(() => {
  return Object.values(passwordStrength.value).every(value => value === true)
})

// Verificar correspondência de senhas quando a confirmação de senha mudar
watch(() => formData.confirmPassword, (newValue) => {
  if (newValue && formData.newPassword !== newValue) {
    errors.confirmPassword = 'As senhas não coincidem'
  } else {
    errors.confirmPassword = ''
  }
})

const resetForm = () => {
  formData.currentPassword = ''
  formData.newPassword = ''
  formData.confirmPassword = ''
  
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
  
  // Validar senha atual
  if (!formData.currentPassword) {
    errors.currentPassword = 'A senha atual é obrigatória'
    isValid = false
  }
  
  // Validar nova senha
  if (!formData.newPassword) {
    errors.newPassword = 'A nova senha é obrigatória'
    isValid = false
  } else if (!isPasswordValid.value) {
    errors.newPassword = 'A senha não atende aos requisitos mínimos'
    isValid = false
  }
  
  // Validar confirmação de senha
  if (!formData.confirmPassword) {
    errors.confirmPassword = 'A confirmação de senha é obrigatória'
    isValid = false
  } else if (formData.newPassword !== formData.confirmPassword) {
    errors.confirmPassword = 'As senhas não coincidem'
    isValid = false
  }
  
  return isValid
}

const handleSubmit = async () => {
  if (!validate()) return
  
  try {
    isSubmitting.value = true
    
    await authStore.changePassword({
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword
    })
    
    // Limpar formulário após sucesso
    resetForm()
  } catch (error) {
    // Tratar erros específicos da API
    if (error.response?.data?.message) {
      if (error.response.data.message.includes('current password')) {
        errors.currentPassword = 'Senha atual incorreta'
      } else {
        errors.newPassword = error.response.data.message
      }
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>
