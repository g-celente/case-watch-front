<template>
    <div
        class="relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6 transition-all duration-300 hover:shadow-lg">
        <!-- Banner de capa -->
        <div class="h-36 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-700"></div>

        <!-- Avatar e informações básicas -->
        <div class="flex flex-col lg:flex-row items-center px-6 sm:px-8 py-8 -mt-16 lg:-mt-20 gap-6">
            <!-- Avatar -->
            <div class="relative shrink-0">
                <div class="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-white p-1.5 shadow-xl ring-4 ring-white">
                    <div class="w-full h-full rounded-full bg-gray-100 flex items-center justify-center overflow-hidden group cursor-pointer relative"
                        @click="triggerFileInput">
                        <img v-if="userPhoto" :src="userPhoto" alt="Foto de perfil"
                            class="w-full h-full object-cover rounded-full" />
                        <User v-else class="w-14 h-14 text-gray-300" />

                        <div
                            class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100">
                            <Camera
                                class="w-8 h-8 text-white transform scale-90 group-hover:scale-100 transition-transform duration-300" />
                        </div>
                    </div>

                    <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleFileChange" />

                    <div v-if="isUploading"
                        class="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-t-2 border-white"></div>
                    </div>
                </div>
            </div>

            <!-- Dados do usuário -->
            <div class="flex-1 w-full text-center lg:text-left space-y-2">
                <h1 class="text-2xl font-bold text-gray-900">{{ user?.name }}</h1>
                <p class="text-md text-gray-600">{{ user?.role || 'Usuário' }}</p>

                <div class="mt-4 flex flex-wrap justify-center lg:justify-start gap-2">
                    <span
                        class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 hover:bg-purple-200 transition-colors">
                        <Calendar class="w-3.5 h-3.5 mr-1.5" />
                        Membro desde {{ formatDate(user?.createdAt) }}
                    </span>
                    <span
                        class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors">
                        <Mail class="w-3.5 h-3.5 mr-1.5" />
                        {{ user?.email }}
                    </span>
                </div>
            </div>

            <!-- Botão de edição -->
            <div class="flex justify-center lg:justify-end w-full lg:w-auto">
                <button @click="$emit('edit')"
                    class="inline-flex items-center px-4 py-2 border border-purple-200 shadow-sm text-sm font-medium rounded-lg text-purple-700 bg-white hover:bg-purple-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                    <Edit class="h-4 w-4 mr-2" />
                    Editar Perfil
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { User, Camera, Calendar, Mail, Edit } from 'lucide-vue-next'
import { useAuthStore } from '../../stores/auth/auth.js'
import { useToast } from '../../composables/useToast.js'

const props = defineProps({
    user: {
        type: Object,
        required: true
    }
})

defineEmits(['edit'])

const authStore = useAuthStore()
const { showToast } = useToast()
const fileInput = ref(null)
const isUploading = computed(() => authStore.isUploadingPhoto)

const userPhoto = computed(() => {
    return props.user?.photoUrl || null
})

const triggerFileInput = () => {
    fileInput.value.click()
}

const handleFileChange = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    const validTypes = ['image/jpeg', 'image/png', 'image/gif']
    const maxSize = 5 * 1024 * 1024

    if (!validTypes.includes(file.type)) {
        showToast('Tipo de arquivo inválido. Use JPEG, PNG ou GIF.', 'error')
        return
    }

    if (file.size > maxSize) {
        showToast('Arquivo muito grande. Tamanho máximo: 5MB.', 'error')
        return
    }

    try {
        await authStore.uploadProfilePhoto(file)
        showToast('Foto de perfil atualizada com sucesso!', 'success')
    } catch (error) {
        showToast('Erro ao atualizar foto de perfil.', 'error')
    } finally {
        event.target.value = ''
    }
}

const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(date)
}
</script>
