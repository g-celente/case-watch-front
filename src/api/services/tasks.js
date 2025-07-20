export default (httpClient) => ({
  // Listar tarefas 
  getTasks: (params = {}) => {
    return httpClient.get('/tasks', {params})
  },
  // Buscar tarefa por ID
  getTask: (id) => {
    return httpClient.get(`/tasks/${id}`)
  },
  // Criar tarefa
  createTask: (data) => {
    return httpClient.post('/tasks', data)
  },
  // Atualizar tarefa
  updateTask: (id, data) => {
    return httpClient.put(`/tasks/${id}`, data)
  },
  // Deletar tarefa
  deleteTask: (id) => {
    return httpClient.delete(`/tasks/${id}`)
  },
  // Atualizar status
  updateStatus: (id, status) => {
    return httpClient.patch(`/tasks/${id}/status`, { status })
  },
  // Atualizar prioridade 
  updatePriority: (id, priority) => {
    return httpClient.patch(`/tasks/${id}/priority`, { priority })
  },
  // Atribuir tarefa
  assignTask: (id, userId) => {
    return httpClient.post(`/tasks/${id}/assign`, { userId })
  },
  // Desatribuir tarefa
  unassignTask: (id, userId) => {
    return httpClient.post(`/tasks/${id}/unassign`, { userId })
  },
  // Adicionar colaborador
  addCollaborator: (id, userId, role = 'reviewer') => {
    return httpClient.post(`/tasks/${id}/collaborators`, { userId, role })
  },
  // Remover colaborador
  removeCollaborator: (id, userId) => {
    return httpClient.delete(`/tasks/${id}/collaborators`, { data: { userId } })
  },
  // Minhas tarefas
  getMyTasks: (params = {}) => {
    return httpClient.get('/tasks/my', {params})
  },
  // Tarefas por status
  getTasksByStatus: (status) => {
    return httpClient.get(`/tasks/status/${status}`)
  },
  // Tarefas em atraso
  getOverdueTasks: () => {
    return httpClient.get('/tasks/overdue')
  },
  // Buscar tarefas
  searchTasks: (params = {}) => {
    return httpClient.get('/tasks/search', {params})
  },
  // Estatísticas
  getStats: () => {
    return httpClient.get('/tasks/stats')
  }
})
