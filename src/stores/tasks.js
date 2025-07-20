import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../api/index.js'

export const useTasksStore = defineStore('tasks', () => {
  // State
  const tasks = ref([])
  const currentTask = ref(null)
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
    status: '',
    priority: '',
    categoryId: '',
    assigneeId: '',
    overdue: false,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  })

  // Getters
  const pendingTasks = computed(() => 
    tasks.value.filter(task => task.status === 'pending')
  )
  
  const inProgressTasks = computed(() => 
    tasks.value.filter(task => task.status === 'in_progress')
  )
  
  const completedTasks = computed(() => 
    tasks.value.filter(task => task.status === 'completed')
  )
  
  const overdueTasks = computed(() => 
    tasks.value.filter(task => task.status === 'overdue')
  )

  const taskStats = computed(() => ({
    total: tasks.value.length,
    pending: pendingTasks.value.length,
    inProgress: inProgressTasks.value.length,
    completed: completedTasks.value.length,
    overdue: overdueTasks.value.length
  }))

  // Actions
  const fetchTasks = async (params = {}) => {
    try {
      loading.value = true
      error.value = null
      
      const queryParams = {
        ...filters.value,
        ...params,
        page: pagination.value.page,
        limit: pagination.value.limit
      }

      const response = await api.tasks.getTasks(queryParams)

      if (response.data.success) {
        tasks.value = response.data.data.tasks || response.data.data
        
        if (response.data.data.pagination) {
          pagination.value = {
            ...pagination.value,
            ...response.data.data.pagination
          }
        }
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro ao carregar tarefas'
      console.error('Erro ao buscar tarefas:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchTask = async (id) => {
    try {
      loading.value = true
      error.value = null

      const response = await api.tasks.getTask(id)

      if (response.data.success) {
        currentTask.value = response.data.data
        return response.data.data
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro ao carregar tarefa'
      console.error('Erro ao buscar tarefa:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const createTask = async (taskData) => {
    try {
      loading.value = true
      error.value = null

      const response = await api.tasks.createTask(taskData)

      if (response.data.success) {
        const newTask = response.data.data
        tasks.value.unshift(newTask)
        return newTask
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro ao criar tarefa'
      console.error('Erro ao criar tarefa:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateTask = async (id, taskData) => {
    try {
      loading.value = true
      error.value = null

      const response = await api.tasks.updateTask(id, taskData)

      if (response.data.success) {
        const updatedTask = response.data.data
        const index = tasks.value.findIndex(task => task.id === id)
        
        if (index !== -1) {
          tasks.value[index] = updatedTask
        }
        
        if (currentTask.value?.id === id) {
          currentTask.value = updatedTask
        }
        
        return updatedTask
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro ao atualizar tarefa'
      console.error('Erro ao atualizar tarefa:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteTask = async (id) => {
    try {
      loading.value = true
      error.value = null
      
      await api.tasks.deleteTask(id)

      tasks.value = tasks.value.filter(task => task.id !== id)
      
      if (currentTask.value?.id === id) {
        currentTask.value = null
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro ao deletar tarefa'
      console.error('Erro ao deletar tarefa:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateTaskStatus = async (id, status) => {
    try {
      const response = await api.tasks.updateStatus(id, status)

      if (response.data.success) {
        const index = tasks.value.findIndex(task => task.id === id)
        if (index !== -1) {
          tasks.value[index].status = status
        }
        
        if (currentTask.value?.id === id) {
          currentTask.value.status = status
        }
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro ao atualizar status'
      console.error('Erro ao atualizar status:', err)
      throw err
    }
  }

  const updateTaskPriority = async (id, priority) => {
    try {
      const response = await api.tasks.updatePriority(id, priority)

      if (response.data.success) {
        const index = tasks.value.findIndex(task => task.id === id)
        if (index !== -1) {
          tasks.value[index].priority = priority
        }
        
        if (currentTask.value?.id === id) {
          currentTask.value.priority = priority
        }
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro ao atualizar prioridade'
      console.error('Erro ao atualizar prioridade:', err)
      throw err
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
      status: '',
      priority: '',
      categoryId: '',
      assigneeId: '',
      overdue: false,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    }
    pagination.value.page = 1
  }

  return {
    // State
    tasks,
    currentTask,
    loading,
    error,
    pagination,
    filters,
    
    // Getters
    pendingTasks,
    inProgressTasks,
    completedTasks,
    overdueTasks,
    taskStats,
    
    // Actions
    fetchTasks,
    fetchTask,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    updateTaskPriority,
    setFilters,
    setPage,
    clearError,
    resetFilters
  }
})
