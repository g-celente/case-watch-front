<template>
    <div class="flex min-h-screen">
        <!-- Form Section -->
        <div class="flex-1 flex items-center justify-center bg-white px-4 sm:px-6 lg:px-8">
            <div class="max-w-md w-full space-y-8">
                <div class="text-center">
                    <div class="mx-auto h-12 w-12 bg-primary rounded-lg flex items-center justify-center">
                        <CheckSquare class="w-8 h-8 text-white" />
                    </div>
                    <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
                        Entre na sua conta
                    </h2>
                    <p class="mt-2 text-sm text-gray-600">
                        Ou
                        <router-link to="/register" class="font-medium text-primary hover:text-primary/80 ml-1">
                            crie uma nova conta
                        </router-link>
                    </p>
                </div>

                <Card class="shadow-lg border-0">
                    <CardContent class="p-8">
                        <form @submit.prevent="handleSubmit" class="space-y-6">
                            <!-- Email -->
                            <div class="space-y-2">
                                <Label for="email" class="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Email
                                </Label>
                                <div class="relative">
                                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail class="h-5 w-5 text-gray-400" />
                                    </div>
                                    <Input id="email" v-model="form.email" type="email" required class="pl-10"
                                        placeholder="seu@email.com" :disabled="authStore.isLoading" />
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
                                    <Input id="password" v-model="form.password"
                                        :type="showPassword ? 'text' : 'password'" required class="pl-10 pr-10"
                                        placeholder="••••••••" :disabled="authStore.isLoading" />
                                    <button type="button" @click="showPassword = !showPassword"
                                        class="absolute inset-y-0 right-0 pr-3 flex items-center">
                                        <Eye v-if="!showPassword" class="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                        <EyeOff v-else class="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    </button>
                                </div>
                            </div>

                            <!-- Remember me & Forgot password -->
                            <div class="flex items-center justify-between">
                                <div class="flex items-center">
                                    <input id="remember-me" v-model="form.rememberMe" type="checkbox"
                                        class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
                                    <Label for="remember-me" class="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                        Lembrar de mim
                                    </Label>
                                </div>
                                <button type="button" class="text-sm text-primary hover:text-primary/80"
                                    @click="forgotPassword">
                                    Esqueci minha senha
                                </button>
                            </div>

                            <!-- Error message -->
                            <div v-if="error"
                                class="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
                                {{ errorMessage }}
                            </div>

                            <!-- Submit button -->
                            <Button type="submit" class="w-full h-12 text-base font-medium"
                                :disabled="authStore.isLoading">
                                <span v-if="authStore.isLoading" class="flex items-center">
                                    <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Entrando...
                                </span>
                                <span v-else>Entrar</span>
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
                    <!-- SVG Illustration -->
                    <svg class="w-full max-w-md mx-auto" viewBox="0 0 400 300" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <!-- Background Circle -->
                        <circle cx="200" cy="150" r="120" fill="rgba(255,255,255,0.1)" />

                        <!-- Computer/Laptop -->
                        <rect x="120" y="130" width="160" height="100" rx="8" fill="white" />
                        <rect x="130" y="140" width="140" height="80" rx="4" fill="#f3f4f6" />

                        <!-- Screen Content -->
                        <rect x="140" y="150" width="120" height="4" rx="2" fill="#6C63FF" />
                        <rect x="140" y="160" width="80" height="3" rx="1.5" fill="#d1d5db" />
                        <rect x="140" y="170" width="100" height="3" rx="1.5" fill="#d1d5db" />

                        <!-- Login Form Representation -->
                        <rect x="150" y="185" width="100" height="8" rx="4" fill="rgba(108,99,255,0.3)" />
                        <rect x="150" y="198" width="100" height="8" rx="4" fill="rgba(108,99,255,0.3)" />
                        <rect x="150" y="212" width="60" height="6" rx="3" fill="#6C63FF" />

                        <!-- Security Icons -->
                        <circle cx="320" cy="80" r="25" fill="rgba(255,255,255,0.2)" />
                        <path d="M310 75h20v10h-20z" fill="white" />
                        <circle cx="320" cy="82" r="3" fill="#6C63FF" />

                        <!-- Check Mark -->
                        <circle cx="80" cy="220" r="20" fill="rgba(255,255,255,0.2)" />
                        <path d="M75 220l5 5 10-10" stroke="white" stroke-width="2" fill="none" />
                    </svg>
                </div>

                <h3 class="text-2xl font-bold mb-4">
                    Bem-vindo ao TaskManager
                </h3>
                <p class="text-lg opacity-90">
                    A melhor experiência de gerenciamento de tarefas que você já teve na sua vida.
                </p>
                <div class="mt-8 text-sm opacity-75">
                    <p>✓ Seguro e confiável</p>
                    <p>✓ Interface moderna</p>
                    <p>✓ Produtividade garantida</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed  } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth/auth.js'
import { CheckSquare, Mail, Lock, Eye, EyeOff } from 'lucide-vue-next'

// Components
import Card from '../../components/ui/Card.vue'
import CardContent from '../../components/ui/CardContent.vue'
import Button from '../../components/ui/Button.vue'
import Input from '../../components/ui/Input.vue'
import Label from '../../components/ui/Label.vue'

const router = useRouter()
const authStore = useAuthStore()
const isLoading = computed(() => authStore.isLoading)

const showPassword = ref(false)
const error = ref(false)
const errorMessage = ref('')

const form = ref({
    email: '',
    password: '',
    rememberMe: false
})

const handleSubmit = async () => {
    error.value = false
    errorMessage.value = ''

    try {
        const response = await authStore.login({
            email: form.value.email,
            password: form.value.password
        })

        if (!response.data) {
            error.value = true
            errorMessage.value = 'Erro ao fazer login. Verifique suas credenciais.'
            return
        }

        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        router.push('/dashboard')
    } catch (err) {
        error.value = true
        errorMessage.value = authStore.error || 'Erro ao fazer login'

        setTimeout(() => {
            error.value = false
            errorMessage.value = ''
        }, 5000)
    }
}

const forgotPassword = () => {
    // Implementar funcionalidade de esqueci senha
    console.log('Esqueci minha senha')
}
</script>
