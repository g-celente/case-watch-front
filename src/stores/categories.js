import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../api/index.js'

export const useCategoriesStore = defineStore('categories', () => {
  // State
  const categories = ref([])
  const currentCategory = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const pagination = ref({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })
  const filters = ref({
    search: '',
    sortBy: 'name',
    sortOrder: 'asc'
  })

  // Getters
  const categoriesOptions = computed(() =>
    categories.value.map(category => ({
      value: category.id,
      label: category.name,
      color: category.color
    }))
  )

  const getCategoryById = computed(() => {
    return (id) => categories.value.find(category => category.id === id)
  })

  // Actions
  const fetchCategories = async (params = {}) => {
    try {
      loading.value = true
      error.value = null
      
      const queryParams = {
        ...filters.value,
        ...params,
        page: pagination.value.page,
        limit: pagination.value.limit
      }

      const response = await api.categories.getCategories(queryParams)

      if (response.data.success) {
        categories.value = response.data.data.categories || response.data.data
        
        if (response.data.data.pagination) {
          pagination.value = {
            ...pagination.value,
            ...response.data.data.pagination
          }
        }
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro ao carregar categorias'
      console.error('Erro ao buscar categorias:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchCategory = async (id) => {
    try {
      loading.value = true
      error.value = null

      const response = await api.categories.getCategory(id)

      if (response.data.success) {
        currentCategory.value = response.data.data
        return response.data.data
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro ao carregar categoria'
      console.error('Erro ao buscar categoria:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const createCategory = async (categoryData) => {
    try {
      loading.value = true
      error.value = null

      const response = await api.categories.createCategory(categoryData)

      if (response.data.success) {
        const newCategory = response.data.data
        categories.value.unshift(newCategory)
        return newCategory
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro ao criar categoria'
      console.error('Erro ao criar categoria:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateCategory = async (id, categoryData) => {
    try {
      loading.value = true
      error.value = null

      const response = await api.categories.updateCategory(id, categoryData)

      if (response.data.success) {
        const updatedCategory = response.data.data
        const index = categories.value.findIndex(category => category.id === id)
        
        if (index !== -1) {
          categories.value[index] = updatedCategory
        }
        
        if (currentCategory.value?.id === id) {
          currentCategory.value = updatedCategory
        }
        
        return updatedCategory
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro ao atualizar categoria'
      console.error('Erro ao atualizar categoria:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteCategory = async (id) => {
    try {
      loading.value = true
      error.value = null

      await api.categories.deleteCategory(id)

      categories.value = categories.value.filter(category => category.id !== id)
      
      if (currentCategory.value?.id === id) {
        currentCategory.value = null
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro ao deletar categoria'
      console.error('Erro ao deletar categoria:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchCategoriesWithStats = async (params = {}) => {
    try {
      loading.value = true
      error.value = null
      
      const queryParams = {
        ...filters.value,
        ...params,
        page: pagination.value.page,
        limit: pagination.value.limit
      }

      const response = await api.categories.getCategoriesWithStats(queryParams)

      if (response.data.success) {
        categories.value = response.data.data.categories || response.data.data
        
        if (response.data.data.pagination) {
          pagination.value = {
            ...pagination.value,
            ...response.data.data.pagination
          }
        }
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro ao carregar categorias com estatísticas'
      console.error('Erro ao buscar categorias com estatísticas:', err)
    } finally {
      loading.value = false
    }
  }

  const setFilters = (newFilters) => {
    filters.value = { ...filters.value, ...newFilters }
    pagination.value.page = 1 // Reset to first page when filtering
  }

  const setPage = (page) => {
    pagination.value.page = page
  }

  const clearError = () => {
    error.value = null
  }

  const resetFilters = () => {
    filters.value = {
      search: '',
      sortBy: 'name',
      sortOrder: 'asc'
    }
    pagination.value.page = 1
  }

  return {
    // State
    categories,
    currentCategory,
    loading,
    error,
    pagination,
    filters,
    
    // Getters
    categoriesOptions,
    getCategoryById,
    
    // Actions
    fetchCategories,
    fetchCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    fetchCategoriesWithStats,
    setFilters,
    setPage,
    clearError,
    resetFilters
  }
})
