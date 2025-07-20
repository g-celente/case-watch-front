export default (httpClient) => ({
  // Listar tarefas 
  getTasks: (params = {}) => {
    return httpClient.get('/api/tasks', { params })
  },
  // Buscar tarefa por ID
  getTask: (id) => {
    return httpClient.get(`/api/tasks/${id}`)
  },
  // Criar tarefa
  createTask: (data) => {
    return httpClient.post('/api/tasks', data)
  },
  // Atualizar tarefa
  updateTask: (id, data) => {
    return httpClient.put(`/api/tasks/${id}`, data)
  },
  // Deletar tarefa
  deleteTask: (id) => {
    return httpClient.delete(`/api/tasks/${id}`)
  },
  // Atualizar status
  updateStatus: (id, status) => {
    return httpClient.patch(`/api/tasks/${id}/status`, { status })
  },
  // Atualizar prioridade 
  updatePriority: (id, priority) => {
    return httpClient.patch(`/api/tasks/${id}/priority`, { priority })
  },
  // Atribuir tarefa
  assignTask: (id, userId) => {
    return httpClient.post(`/api/tasks/${id}/assign`, { userId })
  },
  // Desatribuir tarefa
  unassignTask: (id, userId) => {
    return httpClient.post(`/api/tasks/${id}/unassign`, { userId })
  },
  // Adicionar colaborador
  addCollaborator: (id, userId, role = 'reviewer') => {
    return httpClient.post(`/api/tasks/${id}/collaborators`, { userId, role })
  },
  // Remover colaborador
  removeCollaborator: (id, userId) => {
    return httpClient.delete(`/api/tasks/${id}/collaborators`, { data: { userId } })
  },
  // Minhas tarefas
  getMyTasks: (params = {}) => {
    return httpClient.get('/api/tasks/my', { params })
  },
  // Tarefas por status
  getTasksByStatus: (status) => {
    return httpClient.get(`/api/tasks/status/${status}`)
  },
  // Tarefas em atraso
  getOverdueTasks: () => {
    return httpClient.get('/api/tasks/overdue')
  },
  // Buscar tarefas
  searchTasks: (params = {}) => {
    return httpClient.get('/api/tasks/search', { params })
  },
  // Estatísticas
  getStats: () => {
    return httpClient.get('/api/tasks/stats')
  }
})
