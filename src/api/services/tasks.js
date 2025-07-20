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
  assignTask: (id, data) => {
    return httpClient.post(`/tasks/${id}/assign`, data)
  },
  // Desatribuir tarefa
  unassignTask: (id) => {
    return httpClient.post(`/tasks/${id}/unassign`)
  },
  // Adicionar colaborador
  addCollaborator: (id, data) => {
    return httpClient.post(`/tasks/${id}/collaborate`, data)
  },
  // Remover colaborador
  removeCollaborator: (id, userId) => {
    return httpClient.delete(`/tasks/${id}/collaborate`, { data: { userId } })
  },
  // Obter permissões do usuário
  getUserPermissions: (id) => {
    return httpClient.get(`/tasks/${id}/permissions`)
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
