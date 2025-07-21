<template>
  <div class="flex min-h-screen">
    <!-- Form Section -->
    <div class="flex-1 flex items-center justify-center bg-white  px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div class="text-center">
          <div class="mx-auto h-12 w-12 bg-primary rounded-lg flex items-center justify-center">
            <CheckSquare class="w-8 h-8 text-white" />
          </div>
          <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
            Crie sua conta
          </h2>
          <p class="mt-2 text-sm text-gray-600">
            Ou
            <router-link
              to="/login"
              class="font-medium text-primary hover:text-primary/80 ml-1"
            >
              entre na sua conta existente
            </router-link>
          </p>
        </div>

        <Card class="shadow-lg border-0">
          <CardContent class="p-8">
            <form @submit.prevent="handleSubmit" class="space-y-6">
              <!-- Name -->
              <div class="space-y-2">
                <Label for="name" class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nome completo
                </Label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User class="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="name"
                    v-model="form.name"
                    type="text"
                    required
                    class="pl-10"
                    placeholder="Seu nome completo"
                    :disabled="authStore.isLoading"
                  />
                </div>
              </div>

              <!-- Email -->
              <div class="space-y-2">
                <Label for="email" class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </Label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail class="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="email"
                    v-model="form.email"
                    type="email"
                    required
                    class="pl-10"
                    placeholder="seu@email.com"
                    :disabled="authStore.isLoading"
                  />
                </div>
              </div>

              <!-- Password -->
              <div class="space-y-2">
                <Label for="password" class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Senha
                </Label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock class="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="password"
                    v-model="form.password"
                    :type="showPassword ? 'text' : 'password'"
                    required
                    class="pl-10 pr-10"
                    placeholder="••••••••"
                    :disabled="authStore.isLoading"
                  />
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <Eye v-if="!showPassword" class="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    <EyeOff v-else class="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  </button>
                </div>
                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Mínimo de 8 caracteres
                </p>
              </div>

              <!-- Confirm Password -->
              <div class="space-y-2">
                <Label for="confirmPassword" class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Confirmar senha
                </Label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock class="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="confirmPassword"
                    v-model="form.confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    required
                    class="pl-10 pr-10"
                    placeholder="••••••••"
                    :disabled="authStore.isLoading"
                  />
                  <button
                    type="button"
                    @click="showConfirmPassword = !showConfirmPassword"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <Eye v-if="!showConfirmPassword" class="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    <EyeOff v-else class="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  </button>
                </div>
              </div>

              <!-- Error message -->
              <div v-if="error" class="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
                {{ errorMessage }}
              </div>

              <div v-if="passwordError" class="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
                {{ passwordError }}
              </div>

              <!-- Submit button -->
              <Button
                type="submit"
                class="w-full h-12 text-base font-medium"
                :disabled="authStore.isLoading || !!passwordError"
              >
                <span v-if="authStore.isLoading" class="flex items-center">
                  <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Criando conta...
                </span>
                <span v-else>Criar conta</span>
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>

    <!-- Illustration Section -->
    <div class="flex-1 hidden md:flex items-center justify-center bg-[#6C63FF] text-white p-8">
      <div class="text-center max-w-lg">
        <div class="mb-8">
          <!-- SVG Illustration for Register -->
          <svg
            class="w-full max-w-md mx-auto"
            viewBox="0 0 400 300"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <!-- Background Circle -->
            <circle cx="200" cy="150" r="120" fill="rgba(255,255,255,0.1)" />
            
            <!-- User Profile -->
            <circle cx="200" cy="120" r="40" fill="white" />
            <circle cx="200" cy="110" r="15" fill="#6C63FF" />
            <path d="M175 140c0-14 11-25 25-25s25 11 25 25" fill="#6C63FF" />
            
            <!-- Form Elements -->
            <rect x="120" y="180" width="160" height="8" rx="4" fill="rgba(255,255,255,0.8)" />
            <rect x="120" y="195" width="160" height="8" rx="4" fill="rgba(255,255,255,0.6)" />
            <rect x="120" y="210" width="160" height="8" rx="4" fill="rgba(255,255,255,0.4)" />
            
            <!-- Success Checkmarks -->
            <circle cx="80" cy="80" r="15" fill="rgba(255,255,255,0.2)" />
            <path d="M75 80l5 5 10-10" stroke="white" stroke-width="2" fill="none" />
            
            <circle cx="320" cy="220" r="15" fill="rgba(255,255,255,0.2)" />
            <path d="M315 220l5 5 10-10" stroke="white" stroke-width="2" fill="none" />
            
            <!-- Security Badge -->
            <rect x="160" y="240" width="80" height="20" rx="10" fill="rgba(255,255,255,0.2)" />
            <circle cx="170" cy="250" r="3" fill="white" />
            <text x="180" y="254" fill="white" font-size="8" font-family="sans-serif">Seguro</text>
          </svg>
        </div>
        
        <h3 class="text-2xl font-bold mb-4">
          Junte-se ao TaskManager
        </h3>
        <p class="text-lg opacity-90">
          Comece sua jornada de produtividade hoje mesmo. Rápido, fácil e seguro.
        </p>
        <div class="mt-8 text-sm opacity-75">
          <p>✓ Conta gratuita</p>
          <p>✓ Configuração em segundos</p>
          <p>✓ Sem compromisso</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth/auth.js'
import { CheckSquare, Mail, Lock, Eye, EyeOff, User } from 'lucide-vue-next'

// Components
import Card from '../../components/ui/Card.vue'
import CardContent from '../../components/ui/CardContent.vue'
import Button from '../../components/ui/Button.vue'
import Input from '../../components/ui/Input.vue'
import Label from '../../components/ui/Label.vue'

const router = useRouter()
const authStore = useAuthStore()

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const error = ref(false)
const errorMessage = ref('')

const form = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const passwordError = computed(() => {
  if (form.value.password && form.value.confirmPassword) {
    if (form.value.password !== form.value.confirmPassword) {
      return 'As senhas não coincidem'
    }
  }
  if (form.value.password && form.value.password.length < 8) {
    return 'A senha deve ter pelo menos 8 caracteres'
  }
  return null
})

const handleSubmit = async () => {
  if (passwordError.value) return

  try {
    error.value = false
    errorMessage.value = ''

    await authStore.register({
      name: form.value.name,
      email: form.value.email,
      password: form.value.password
    })

    // Registro bem-sucedido - o store já gerencia o token
    router.push('/dashboard')
  } catch (err) {
    error.value = true
    errorMessage.value = err.response?.data?.message || 'Erro ao criar conta. Tente novamente.'
    
    // Limpar erro após 5 segundos
    setTimeout(() => {
      error.value = false
      errorMessage.value = ''
    }, 5000)
  }
}
</script>
