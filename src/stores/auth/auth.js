import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../../api/index.js'

export const useAuthStore = defineStore('auth', () => {

  const error = ref(null)
  const isLoading = ref(false)

  const login = async (credentials) => {
    try {
      isLoading.value = true
      error.value = null
      const response = await api.auth.login(credentials)
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
    login,
    register,
    logout,
    fetchProfile,
    updateProfile,
    changePassword
  }
})
