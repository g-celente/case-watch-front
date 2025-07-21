<template>
  <div class="container mx-auto px-4 py-8 max-w-7xl">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Coluna lateral -->
      <div class="lg:col-span-1 space-y-8">
        <ProfileHeader :user="user" :isLoading="isLoadingUser" :isUploading="isUploadingPhoto"
          @upload-photo="handlePhotoUpload" @edit="() => { }" />
      </div>

      <!-- Coluna principal: Editar Perfil -->
      <div class="lg:col-span-2 space-y-6">
        <ProfileEdit />
        <ProfilePassword />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth/auth.js'

// Componentes
import ProfileHeader from '../components/profile/ProfileHeader.vue'
import ProfileEdit from '../components/profile/ProfileEdit.vue'
import ProfilePassword from '../components/profile/ProfilePassword.vue'

const authStore = useAuthStore()

const user = computed(() => authStore.user)
const isLoadingUser = computed(() => authStore.isLoading)
const isUploadingPhoto = computed(() => authStore.isUploadingPhoto)

onMounted(async () => {
  if (!user.value || !user.value.id) {
    await authStore.fetchCurrentUser()
  }
})

const handlePhotoUpload = async (file) => {
  if (!file) return
  const formData = new FormData()
  formData.append('photo', file)
  await authStore.uploadProfilePhoto(formData)
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
