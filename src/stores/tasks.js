import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../api/index.js'

export const useTasksStore = defineStore('tasks', () => {
    // State
    const tasks = ref([])
    const currentTask = ref(null)
    const loading = ref(false)
    const error = ref(null)
    const collaborators = ref([])
    const userPermissions = ref({})
    const assignee = ref(null)
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
        tasks.value.filter(task => task.status === 'PENDING')
    )

    const inProgressTasks = computed(() =>
        tasks.value.filter(task => task.status === 'IN_PROGRESS')
    )

    const completedTasks = computed(() =>
        tasks.value.filter(task => task.status === 'COMPLETED')
    )

    const overdueTasks = computed(() =>
        tasks.value.filter(task => task.status === 'OVERDUE')
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

            const merged = {
                page: pagination.value.page,
                limit: pagination.value.limit,
                ...filters.value,
                ...params
            }

            // Remove filtros vazios
            const queryParams = Object.fromEntries(
                Object.entries(merged).filter(([_, v]) =>
                    v !== '' && v !== null && v !== undefined && v !== false
                )
            )

            const response = await api.tasks.getTasks(queryParams)

            if (response.data.success) {
                const data = response.data.data
                tasks.value = data.tasks || data

                if (data.pagination) {
                    pagination.value = {
                        ...pagination.value,
                        ...data.pagination
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

    // Collaboration Actions
    const addCollaborator = async (taskId, userId, role) => {
        try {
            loading.value = true
            error.value = null

            const response = await api.tasks.addCollaborator(taskId, { userId, role })

            if (response.data.success) {
                // Update task in list
                const taskIndex = tasks.value.findIndex(task => task.id === taskId)
                if (taskIndex !== -1 && response.data.data.collaborators) {
                    tasks.value[taskIndex].collaborators = response.data.data.collaborators
                }

                // Update current task if viewing
                if (currentTask.value?.id === taskId) {
                    currentTask.value.collaborators = response.data.data.collaborators
                    await calculateUserPermissions(taskId)
                }

                return response.data.data
            }
        } catch (err) {
            error.value = err.response?.data?.message || 'Erro ao adicionar colaborador'
            console.error('Erro ao adicionar colaborador:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    const removeCollaborator = async (taskId, userId) => {
        try {
            loading.value = true
            error.value = null

            const response = await api.tasks.removeCollaborator(taskId, userId)

            if (response.data.success) {
                // Update task in list
                const taskIndex = tasks.value.findIndex(task => task.id === taskId)
                if (taskIndex !== -1 && response.data.data.collaborators) {
                    tasks.value[taskIndex].collaborators = response.data.data.collaborators
                }

                // Update current task if viewing
                if (currentTask.value?.id === taskId) {
                    currentTask.value.collaborators = response.data.data.collaborators
                    await calculateUserPermissions(taskId)
                }

                return response.data.data
            }
        } catch (err) {
            error.value = err.response?.data?.message || 'Erro ao remover colaborador'
            console.error('Erro ao remover colaborador:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    const assignTask = async (taskId, userId) => {
        try {
            loading.value = true
            error.value = null

            const response = await api.tasks.assignTask(taskId, { userId })

            if (response.data.success) {
                // Update task in list
                const taskIndex = tasks.value.findIndex(task => task.id === taskId)
                if (taskIndex !== -1) {
                    tasks.value[taskIndex].assignee = response.data.data.assignee
                }

                // Update current task if viewing
                if (currentTask.value?.id === taskId) {
                    currentTask.value.assignee = response.data.data.assignee
                    assignee.value = response.data.data.assignee
                }

                return response.data.data
            }
        } catch (err) {
            error.value = err.response?.data?.message || 'Erro ao atribuir tarefa'
            console.error('Erro ao atribuir tarefa:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    const unassignTask = async (taskId) => {
        try {
            loading.value = true
            error.value = null

            const response = await api.tasks.unassignTask(taskId)

            if (response.data.success) {
                // Update task in list
                const taskIndex = tasks.value.findIndex(task => task.id === taskId)
                if (taskIndex !== -1) {
                    tasks.value[taskIndex].assignee = null
                }

                // Update current task if viewing
                if (currentTask.value?.id === taskId) {
                    currentTask.value.assignee = null
                    assignee.value = null
                }

                return response.data.data
            }
        } catch (err) {
            error.value = err.response?.data?.message || 'Erro ao desatribuir tarefa'
            console.error('Erro ao desatribuir tarefa:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    const calculateUserPermissions = async (taskId) => {
        try {
            const response = await api.tasks.getUserPermissions(taskId)
            
            if (response.data.success) {
                userPermissions.value = response.data.data
            }
        } catch (err) {
            console.error('Erro ao calcular permissões:', err)
            userPermissions.value = {
                canEdit: false,
                canDelete: false,
                canManageCollaborators: false,
                canAssign: false,
                currentUserRole: 'VIEWER'
            }
        }
    }

    const getUserPermissions = (taskId, userId) => {
        const task = tasks.value.find(t => t.id === taskId)
        if (!task || !userId) {
            return {
                canEdit: false,
                canDelete: false,
                canManageCollaborators: false,
                canAssign: false,
                currentUserRole: 'VIEWER'
            }
        }

        // If user is the assignee, they can edit
        if (task.assignee?.id === userId) {
            return {
                canEdit: true,
                canDelete: false,
                canManageCollaborators: false,
                canAssign: false,
                currentUserRole: 'ASSIGNEE'
            }
        }

        // Check collaborator role
        const collaborator = task.collaborators?.find(c => c.id === userId)
        if (collaborator) {
            const role = collaborator.role
            return {
                canEdit: ['OWNER', 'ADMIN', 'EDITOR'].includes(role),
                canDelete: ['OWNER', 'ADMIN'].includes(role),
                canManageCollaborators: ['OWNER', 'ADMIN'].includes(role),
                canAssign: ['OWNER', 'ADMIN'].includes(role),
                currentUserRole: role
            }
        }

        // Default permissions for non-collaborators
        return {
            canEdit: false,
            canDelete: false,
            canManageCollaborators: false,
            canAssign: false,
            currentUserRole: 'VIEWER'
        }
    }

    const setCurrentTask = (task) => {
        currentTask.value = task
        if (task) {
            collaborators.value = task.collaborators || []
            assignee.value = task.assignee || null
            calculateUserPermissions(task.id)
        }
    }

    return {
        // State
        tasks,
        currentTask,
        loading,
        error,
        pagination,
        filters,
        collaborators,
        userPermissions,
        assignee,

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
        resetFilters,
        // Collaboration Actions
        addCollaborator,
        removeCollaborator,
        assignTask,
        unassignTask,
        calculateUserPermissions,
        getUserPermissions,
        setCurrentTask
    }
})
