export default (httpClient) => ({
  // Listar categorias
  getCategories: (params = {}) => {
    return httpClient.get('/api/categories', { params })
  },
  // Buscar categoria por ID
  getCategory: (id) => {
    return httpClient.get(`/api/categories/${id}`)
  },
  // Criar categoria
  createCategory: (data) => {
    return httpClient.post('/api/categories', data)
  },
  // Atualizar categoria
  updateCategory: (id, data) => {
    return httpClient.put(`/api/categories/${id}`, data)
  },
  // Deletar categoria
  deleteCategory: (id) => {
    return httpClient.delete(`/api/categories/${id}`)
  },
  // Minhas categorias
  getMyCategories: (params = {}) => {
    return httpClient.get('/api/categories/my', { params })
  },
  // Buscar categorias
  searchCategories: (params = {}) => {
    return httpClient.get('/api/categories/search', { params })
  },
  // Estatísticas da categoria
  getCategoryStats: (id) => {
    return httpClient.get(`/api/categories/${id}/stats`)
  },
  // Categorias com estatísticas
  getCategoriesWithStats: (params = {}) => {  
    return httpClient.get('/api/categories/with-stats', { params })
  }
})