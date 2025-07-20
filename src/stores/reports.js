import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'
import api from '../api/index.js'

export const useReportsStore = defineStore('reports', () => {
    // State
    const loading = ref(false)
    const error = ref(null)

    // Dashboard data
    const dashboardData = ref({})
    const tasksByStatus = ref([])
    const tasksByCategory = ref([])
    const userPerformance = ref([])
    const productivity = ref([])
    const collaboration = ref([])
    const recentActivities = ref([])

    // Overview data
    const overview = ref({})
    const tasksOverview = ref({})
    const categoriesOverview = ref({})
    const performanceOverview = ref({})

    // Temporal data
    const weeklyProductivity = ref([])
    const monthlyProductivity = ref([])

    // Custom reports
    const customReports = ref([])

    // Filters
    const filters = ref({
        dateRange: {
            start: null,
            end: null
        },
        categories: [],
        users: [],
        status: [],
        priority: []
    })

    // Computed properties
    const totalTasks = computed(() => {
        return overview.value?.totalTasks || 0
    })

    const completionRate = computed(() => {
        if (!overview.value?.totalTasks) return 0
        return overview.value?.completionRate || Math.round((overview.value?.completedTasks / overview.value?.totalTasks) * 100) || 0
    })

  const topCategories = computed(() => {
    if (!Array.isArray(tasksByCategory.value)) return []
    return tasksByCategory.value.slice(0, 5)
  })

  const topPerformers = computed(() => {
    if (!Array.isArray(userPerformance.value)) return []
    return userPerformance.value
      .sort((a, b) => b.completionRate - a.completionRate)
      .slice(0, 5)
  })

  // Actions
    const fetchDashboard = async (params = {}) => {
        try {
            loading.value = true
            error.value = null

            const queryParams = {
                ...filters.value,
                ...params
            }

            const response = await api.reports.getDashboard(queryParams)

            if (response.data.success) {
                dashboardData.value = response.data.data
                
                // Atualizando os dados do overview
                overview.value = response.data.data.summary || {}
                
                // Extraindo tarefas por status
                if (response.data.data.breakdown?.tasksByStatus) {
                    const statusData = response.data.data.breakdown.tasksByStatus
                    tasksByStatus.value = Object.entries(statusData).map(([status, count]) => ({
                        label: status,
                        value: count
                    }))
                }
                
                // Carregando atividades recentes
                recentActivities.value = response.data.data.recentTasks || []
            }
        } catch (err) {
            error.value = err.response?.data?.message || 'Erro ao carregar dashboard'
            console.error('Erro ao buscar dashboard:', err)
        } finally {
            loading.value = false
        }
    }

    const fetchTasksByStatus = async (params = {}) => {
        try {
            loading.value = true
            error.value = null

            const queryParams = {
                ...filters.value,
                ...params
            }

            const response = await api.reports.getTasksByStatus(queryParams)

            if (response.data.success) {
                // Transformar os dados do formato da API para o formato esperado pelos gráficos
                const statusData = response.data.data.tasksByStatus
                tasksByStatus.value = Object.entries(statusData).map(([status, count]) => ({
                    label: status,
                    value: count
                }))
                
                // Atualizando overview com dados da resposta
                overview.value = {
                    ...overview.value,
                    totalTasks: response.data.data.totalTasks,
                    completedTasks: response.data.data.completedTasks,
                    completionRate: response.data.data.completionRate
                }
            }
        } catch (err) {
            error.value = err.response?.data?.message || 'Erro ao carregar dados de status'
            console.error('Erro ao buscar tarefas por status:', err)
        } finally {
            loading.value = false
        }
    }

    const fetchTasksByCategory = async (params = {}) => {
        try {
            loading.value = true
            error.value = null

            const queryParams = {
                ...filters.value,
                ...params
            }

            const response = await api.reports.getTasksByCategory(queryParams)

            if (response.data.success) {
                // Transformar os dados da API para o formato esperado pelo gráfico
                tasksByCategory.value = response.data.data.tasksByCategory.map(category => ({
                    id: category.id,
                    label: category.name,
                    value: category.total,
                    completed: category.completed,
                    inProgress: category.inProgress || category.in_progress || 0,
                    pending: category.pending
                }))
            }
        } catch (err) {
            error.value = err.response?.data?.message || 'Erro ao carregar dados de categoria'
            console.error('Erro ao buscar tarefas por categoria:', err)
        } finally {
            loading.value = false
        }
    }

    const fetchUserPerformance = async (params = {}) => {
        try {
            loading.value = true
            error.value = null

            const queryParams = {
                ...filters.value,
                ...params
            }

            const response = await api.reports.getUserPerformance(queryParams)

            if (response.data.success) {
                // Transformando os dados da API para o formato esperado pelo componente
                // No caso de um único usuário, criamos um array com esse usuário
                if (response.data.data.user) {
                    const userData = response.data.data;
                    userPerformance.value = [{
                        id: userData.user.id,
                        name: userData.user.name,
                        completedTasks: userData.summary.completedTasks,
                        totalTasks: userData.summary.totalTasks,
                        completionRate: userData.summary.completionRate,
                        overdueTasks: userData.summary.overdueTasks,
                        averageCompletionDays: userData.summary.averageCompletionDays
                    }];
                } else if (Array.isArray(response.data.data)) {
                    // Se a API retornar um array de usuários
                    userPerformance.value = response.data.data.map(user => ({
                        id: user.id,
                        name: user.name,
                        completedTasks: user.summary?.completedTasks || 0,
                        totalTasks: user.summary?.totalTasks || 0,
                        completionRate: user.summary?.completionRate || 0,
                        overdueTasks: user.summary?.overdueTasks || 0,
                        averageCompletionDays: user.summary?.averageCompletionDays || 0
                    }));
                }
            }
        } catch (err) {
            error.value = err.response?.data?.message || 'Erro ao carregar performance dos usuários'
            console.error('Erro ao buscar performance dos usuários:', err)
        } finally {
            loading.value = false
        }
    }

    const fetchProductivity = async (params = {}) => {
        try {
            loading.value = true
            error.value = null

            const queryParams = {
                ...filters.value,
                ...params
            }

            const response = await api.reports.getProductivity(queryParams)

            if (response.data.success) {
                // Transformar os dados da API para o formato esperado pelo gráfico
                productivity.value = response.data.data.productivityData.map(item => ({
                    period: item.period,
                    created: item.created,
                    completed: item.completed,
                    inProgress: item.inProgress || item.in_progress || 0,
                    pending: item.pending
                }))
            }
        } catch (err) {
            error.value = err.response?.data?.message || 'Erro ao carregar dados de produtividade'
            console.error('Erro ao buscar produtividade:', err)
        } finally {
            loading.value = false
        }
    }

    const fetchCollaboration = async (params = {}) => {
        try {
            loading.value = true
            error.value = null

            const queryParams = {
                ...filters.value,
                ...params
            }

            const response = await api.reports.getCollaboration(queryParams)

            if (response.data.success) {
                collaboration.value = response.data.data
            }
        } catch (err) {
            error.value = err.response?.data?.message || 'Erro ao carregar dados de colaboração'
            console.error('Erro ao buscar colaboração:', err)
        } finally {
            loading.value = false
        }
    }

    const fetchWeeklyProductivity = async (params = {}) => {
        try {
            loading.value = true
            error.value = null

            const queryParams = {
                ...filters.value,
                period: 'weekly',
                ...params
            }

            const response = await api.reports.getProductivity(queryParams)

            if (response.data.success) {
                // Transformar os dados da API para o formato esperado pelo gráfico
                weeklyProductivity.value = response.data.data.productivityData.map(item => ({
                    period: item.period,
                    created: item.created,
                    completed: item.completed,
                    inProgress: item.inProgress || item.in_progress || 0,
                    pending: item.pending
                }))
            }
        } catch (err) {
            error.value = err.response?.data?.message || 'Erro ao carregar produtividade semanal'
            console.error('Erro ao buscar produtividade semanal:', err)
        } finally {
            loading.value = false
        }
    }

    const fetchMonthlyProductivity = async (params = {}) => {
        try {
            loading.value = true
            error.value = null

            const queryParams = {
                ...filters.value,
                period: 'monthly',
                ...params
            }

            const response = await api.reports.getProductivity(queryParams)

            if (response.data.success) {
                // Transformar os dados da API para o formato esperado pelo gráfico
                monthlyProductivity.value = response.data.data.productivityData.map(item => ({
                    period: item.period,
                    created: item.created,
                    completed: item.completed,
                    inProgress: item.inProgress || item.in_progress || 0,
                    pending: item.pending
                }))
            }
        } catch (err) {
            error.value = err.response?.data?.message || 'Erro ao carregar produtividade mensal'
            console.error('Erro ao buscar produtividade mensal:', err)
        } finally {
            loading.value = false
        }
    }

    const createCustomReport = async (config) => {
        try {
            loading.value = true
            error.value = null

            const response = await api.reports.createCustomReport(config)

            if (response.data.success) {
                customReports.value.push(response.data.data)
                return response.data.data
            }
        } catch (err) {
            error.value = err.response?.data?.message || 'Erro ao criar relatório personalizado'
            console.error('Erro ao criar relatório personalizado:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    const exportReport = async (type, format = 'pdf') => {
        try {
            loading.value = true
            error.value = null

            const response = await api.reports.exportReport({
                type,
                format,
                filters: filters.value
            })

            // Handle blob response for file download
            if (response.data instanceof Blob) {
                const url = window.URL.createObjectURL(response.data)
                const link = document.createElement('a')
                link.href = url
                link.download = `relatorio_${type}_${new Date().toISOString().split('T')[0]}.${format}`
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
                window.URL.revokeObjectURL(url)
            }
        } catch (err) {
            error.value = err.response?.data?.message || 'Erro ao exportar relatório'
            console.error('Erro ao exportar relatório:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    const setFilters = (newFilters) => {
        filters.value = { ...filters.value, ...newFilters }
    }

    const resetFilters = () => {
        filters.value = {
            dateRange: {
                start: null,
                end: null
            },
            categories: [],
            users: [],
            status: [],
            priority: []
        }
    }

    const loadAllDashboardData = async () => {
        try {
            loading.value = true

            // Usando Promise.allSettled para não falhar se uma das requisições falhar
            const results = await Promise.allSettled([
                fetchDashboard(),
                fetchTasksByStatus(),
                fetchTasksByCategory(),
                fetchUserPerformance(),
                fetchProductivity()
            ])
            
            // Verificar resultados e logar erros
            results.forEach((result, index) => {
                if (result.status === 'rejected') {
                    console.error(`Falha ao carregar dados (índice ${index}):`, result.reason)
                }
            })
            
        } catch (err) {
            console.error('Erro ao carregar todos os dados do dashboard:', err)
            error.value = 'Erro ao carregar todos os dados do dashboard'
        } finally {
            loading.value = false
        }
    }

    return {
        // State access
        dashboardData,
        tasksByStatus,
        tasksByCategory,
        userPerformance,
        productivity,
        collaboration,
        recentActivities,
        overview,
        tasksOverview,
        categoriesOverview,
        performanceOverview,
        weeklyProductivity,
        monthlyProductivity,
        customReports,
        filters,
        loading,
        error,

        // Computed
        totalTasks,
        completionRate,
        topCategories,
        topPerformers,

        // Actions
        fetchDashboard,
        fetchTasksByStatus,
        fetchTasksByCategory,
        fetchUserPerformance,
        fetchProductivity,
        fetchCollaboration,
        fetchWeeklyProductivity,
        fetchMonthlyProductivity,
        createCustomReport,
        exportReport,
        setFilters,
        resetFilters,
        loadAllDashboardData
    }
})
