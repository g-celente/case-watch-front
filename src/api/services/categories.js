export default (httpClient) => ({
  // Listar categorias
  getCategories: (params = {}) => {
    return httpClient.get('/categories')
  },
  // Buscar categoria por ID
  getCategory: (id) => {
    return httpClient.get(`/categories/${id}`)
  },
  // Criar categoria
  createCategory: (data) => {
    return httpClient.post('/categories', data)
  },
  // Atualizar categoria
  updateCategory: (id, data) => {
    return httpClient.put(`/categories/${id}`, data)
  },
  // Deletar categoria
  deleteCategory: (id) => {
    return httpClient.delete(`/categories/${id}`)
  },
  // Minhas categorias
  getMyCategories: (params = {}) => {
    return httpClient.get('/categories/my')
  },
  // Buscar categorias
  searchCategories: (params = {}) => {
    return httpClient.get('/categories/search')
  },
  // Estatísticas da categoria
  getCategoryStats: (id) => {
    return httpClient.get(`/categories/${id}/stats`)
  },
  // Categorias com estatísticas
  getCategoriesWithStats: (params = {}) => {  
    return httpClient.get('/categories/with-stats')
  }
})