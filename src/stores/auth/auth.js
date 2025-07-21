import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../../api/index.js'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null)
  const token = ref(localStorage.getItem('token'))
  const error = ref(null)
  const isLoading = ref(false)
  const availableUsers = ref([])
  const userStats = ref(null)
  const userActivities = ref([])
  const isUpdatingProfile = ref(false)
  const isUploadingPhoto = ref(false)

  // Getters
  const isAuthenticated = computed(() => !!token.value)
  const currentUser = computed(() => user.value)

  const login = async (credentials) => {
    try {
      isLoading.value = true
      error.value = null
      const response = await api.auth.login(credentials)
      
      if (response.data.success) {
        token.value = response.data.data.token
        user.value = response.data.data.user
        console.log(user.value)
        localStorage.setItem('token', token.value)
      }
      
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro ao fazer login'
      return null
    } finally {
      isLoading.value = false
    }
  }

  const register = async (userData) => {
    try {
      isLoading.value = true
      error.value = null
      const response = await api.auth.register(userData)

      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro ao registrar usuário'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    try {
      if (token.value) {
        await api.auth.logout()
      }
    } catch (err) {
      console.error('Erro ao fazer logout:', err)
    } finally {
      clearAuth()
    }
  }

  const clearAuth = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
  }

  const fetchUsers = async () => {
    try {
      error.value = null
      const response = await api.auth.getUsers()
      
      if (response.data.success) {
        availableUsers.value = response.data.data.users || response.data.data
      }
      
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro ao buscar usuários'
      throw err
    }
  }

  const fetchProfile = async () => {
    try {
      error.value = null
      const response = await api.auth.getProfile()
      
      if (response.data.success) {
        user.value = response.data.data
        localStorage.setItem('user', JSON.stringify(user.value))
      }
      
      return response.data
    } catch (err) {
      console.error('Erro ao buscar perfil:', err)
      throw err
    }
  }

  const updateProfile = async (profileData) => {
    try {
      error.value = null
      isUpdatingProfile.value = true

      const response = await api.auth.updateProfile(profileData)

      if (response.data.success) {
        user.value = { ...user.value, ...profileData }
        localStorage.setItem('user', JSON.stringify(user.value))
      }

      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro ao atualizar perfil'
      throw err
    } finally {
      isUpdatingProfile.value = false
    }
  }

  const changePassword = async (passwordData) => {
    try {
      error.value = null

      const response = await api.auth.changePassword(passwordData)

      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro ao alterar senha'
      throw err
    }
  }

  const fetchUserStats = async () => {
    try {
      error.value = null
      const response = await api.auth.getUserStats()
      
      if (response.data.success) {
        userStats.value = response.data.data
      }
      
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro ao buscar estatísticas do usuário'
      console.error('Erro ao buscar estatísticas:', err)
      throw err
    }
  }

  const fetchUserActivities = async (params = {}) => {
    try {
      error.value = null
      const response = await api.auth.getUserActivities(params)
      
      if (response.data.success) {
        userActivities.value = response.data.data
      }
      
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro ao buscar atividades do usuário'
      console.error('Erro ao buscar atividades:', err)
      throw err
    }
  }

  const uploadProfilePhoto = async (file) => {
    try {
      error.value = null
      isUploadingPhoto.value = true
      
      const formData = new FormData()
      formData.append('photo', file)
      
      const response = await api.auth.uploadProfilePhoto(formData)
      
      if (response.data.success) {
        user.value = { ...user.value, photoUrl: response.data.data.photoUrl }
        localStorage.setItem('user', JSON.stringify(user.value))
      }
      
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro ao fazer upload da foto'
      console.error('Erro ao fazer upload da foto:', err)
      throw err
    } finally {
      isUploadingPhoto.value = false
    }
  }

  return {
    // State
    user,
    token,
    isLoading,
    error,
    availableUsers,
    userStats,
    userActivities,
    isUpdatingProfile,
    isUploadingPhoto,
    // Getters
    isAuthenticated,
    currentUser,
    // Actions
    login,
    register,
    logout,
    clearAuth,
    fetchUsers,
    fetchProfile,
    updateProfile,
    changePassword,
    fetchUserStats,
    fetchUserActivities,
    uploadProfilePhoto
  }
})
