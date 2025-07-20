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
      return response.data
    } catch (err) {
      console.error('Erro ao buscar perfil:', err)
      throw err
    }
  }

  const updateProfile = async (profileData) => {
    try {
      error.value = null

      const response = await api.auth.updateProfile(profileData)

      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro ao atualizar perfil'
      throw err
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

  return {
    // State
    user,
    token,
    isLoading,
    error,
    availableUsers,
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
    changePassword
  }
})
