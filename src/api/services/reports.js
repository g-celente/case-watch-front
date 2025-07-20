export default (httpClient) => ({
  // Relatórios principais
  getTasksByStatus: (params = {}) => {
    return httpClient.get('/reports/tasks-by-status', { params })
  },
  
  getTasksByCategory: (params = {}) => {
    return httpClient.get('/reports/tasks-by-category', { params })
  },
  
  getUserPerformance: (params = {}) => {
    return httpClient.get('/reports/user-performance', { params })
  },
  
  getProductivity: (params = {}) => {
    return httpClient.get('/reports/productivity', { params })
  },
  
  getCollaboration: (params = {}) => {
    return httpClient.get('/reports/collaboration', { params })
  },

  // Dashboard e visões gerais
  getDashboard: (params = {}) => {
    return httpClient.get('/reports/dashboard', { params })
  },
  
  getOverviewTasks: (params = {}) => {
    return httpClient.get('/reports/overview/tasks', { params })
  },
  
  getOverviewCategories: (params = {}) => {
    return httpClient.get('/reports/overview/categories', { params })
  },
  
  getOverviewPerformance: (params = {}) => {
    return httpClient.get('/reports/overview/performance', { params })
  },

  // Produtividade temporal
  getWeeklyProductivity: (params = {}) => {
    return httpClient.get('/reports/productivity/weekly', { params })
  },
  
  getMonthlyProductivity: (params = {}) => {
    return httpClient.get('/reports/productivity/monthly', { params })
  },

  // Relatórios customizados
  createCustomReport: (data) => {
    return httpClient.post('/reports/custom', data)
  },

  // Exportação de dados
  exportReport: (reportType, params = {}) => {
    return httpClient.get(`/reports/${reportType}/export`, { 
      params,
      responseType: 'blob'
    })
  }
})
