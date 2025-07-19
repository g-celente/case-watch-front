<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8">
            <div>
                <div class="mx-auto h-12 w-12 bg-primary rounded-lg flex items-center justify-center">
                    <CheckSquare class="w-8 h-8 text-white" />
                </div>
                <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                    Entre na sua conta
                </h2>
                <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                    Ou
                    <router-link to="/register" class="font-medium text-primary hover:text-primary/80">
                        crie uma nova conta
                    </router-link>
                </p>
            </div>

            <Card class="mt-8">
                <CardContent class="pt-6">
                    <form @submit.prevent="handleSubmit" class="space-y-6">
                        <!-- Email -->
                        <div>
                            <Label for="email">Email</Label>
                            <Input id="email" v-model="form.email" type="email" required class="mt-1"
                                placeholder="seu@email.com" :disabled="authStore.isLoading" />
                        </div>

                        <!-- Password -->
                        <div>
                            <Label for="password">Senha</Label>
                            <Input id="password" v-model="form.password" type="password" required class="mt-1"
                                placeholder="••••••••" :disabled="authStore.isLoading" />
                        </div>

                        <!-- Error message -->
                        <div v-if="error" class="text-sm text-red-600 dark:text-red-400">
                            {{ errorMessage }}
                        </div>


                        <!-- Submit button -->
                        <Button type="submit" class="w-full" :disabled="authStore.isLoading">
                            <span v-if="isLoading">Entrando...</span>
                            <span v-else>Entrar</span>
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
        <BaseAlertError v-if="error" :title="'Erro ao entrar'" :text="errorMessage" type="error" />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth/auth.js'
import { CheckSquare } from 'lucide-vue-next'


// Components
import Card from '../components/ui/Card.vue'
import CardContent from '../components/ui/CardContent.vue'
import Button from '../components/ui/Button.vue'
import Input from '../components/ui/Input.vue'
import Label from '../components/ui/Label.vue'
import BaseAlertError from '../components/alert/BaseAlertError.vue'

const router = useRouter()
const authStore = useAuthStore()
const isLoading = ref(false)
const error = ref(null)
const errorMessage = ref('')

const form = ref({
    email: '',
    password: ''
})

const handleSubmit = async () => {
    isLoading.value = true
    error.value = false

    try {
        const login = await authStore.login(form.value)

        if (!login.data.token) {
            error.value = true
            errorMessage.value = login.message|| 'Erro ao fazer login. Tente novamente.'
        }

        localStorage.setItem("token", login.data.token)
        router.push("/dashboard")

    } catch (err) {
        error.value = true
        errorMessage.value = 'Credenciais inválidas. Verifique seu email e senha.'
        setTimeout(() => {
            error.value = false
            errorMessage.value = ''
        }, 5000)

    }
}
</script>
