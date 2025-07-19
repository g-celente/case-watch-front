<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <div class="mx-auto h-12 w-12 bg-primary rounded-lg flex items-center justify-center">
          <CheckSquare class="w-8 h-8 text-white" />
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Crie sua conta
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Ou
          <router-link
            to="/login"
            class="font-medium text-primary hover:text-primary/80"
          >
            entre na sua conta existente
          </router-link>
        </p>
      </div>

      <Card class="mt-8">
        <CardContent class="pt-6">
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Name -->
            <div>
              <Label for="name">Nome completo</Label>
              <Input
                id="name"
                v-model="form.name"
                type="text"
                required
                class="mt-1"
                placeholder="Seu nome completo"
                :disabled="authStore.isLoading"
              />
            </div>

            <!-- Email -->
            <div>
              <Label for="email">Email</Label>
              <Input
                id="email"
                v-model="form.email"
                type="email"
                required
                class="mt-1"
                placeholder="seu@email.com"
                :disabled="authStore.isLoading"
              />
            </div>

            <!-- Password -->
            <div>
              <Label for="password">Senha</Label>
              <Input
                id="password"
                v-model="form.password"
                type="password"
                required
                class="mt-1"
                placeholder="••••••••"
                :disabled="authStore.isLoading"
              />
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Mínimo de 6 caracteres
              </p>
            </div>

            <!-- Confirm Password -->
            <div>
              <Label for="confirmPassword">Confirmar senha</Label>
              <Input
                id="confirmPassword"
                v-model="form.confirmPassword"
                type="password"
                required
                class="mt-1"
                placeholder="••••••••"
                :disabled="authStore.isLoading"
              />
            </div>

            <!-- Error message -->
            <div v-if="authStore.error" class="text-sm text-destructive">
              {{ authStore.error }}
            </div>

            <div v-if="passwordError" class="text-sm text-destructive">
              {{ passwordError }}
            </div>

            <!-- Submit button -->
            <Button
              type="submit"
              class="w-full"
              :disabled="authStore.isLoading || !!passwordError"
            >
              <span v-if="authStore.isLoading">Criando conta...</span>
              <span v-else>Criar conta</span>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth/auth.js'
import { CheckSquare } from 'lucide-vue-next'

// Components
import Card from '../components/ui/Card.vue'
import CardContent from '../components/ui/CardContent.vue'
import Button from '../components/ui/Button.vue'
import Input from '../components/ui/Input.vue'
import Label from '../components/ui/Label.vue'

const router = useRouter()
const authStore = useAuthStore()

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
  if (form.value.password && form.value.password.length < 6) {
    return 'A senha deve ter pelo menos 6 caracteres'
  }
  return null
})

const handleSubmit = async () => {
  if (passwordError.value) return

  try {
    const userData = {
      name: form.value.name,
      email: form.value.email,
      password: form.value.password
    }
    
    await authStore.register(userData)
    router.push('/dashboard')
  } catch (error) {
    console.error('Erro no registro:', error)
  }
}
</script>
