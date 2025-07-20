// Mock API interceptor para desenvolvimento local
import axios from 'axios'

const mockData = {
  tasks: [
    {
      id: '1',
      title: 'Implementar CRUD de tarefas',
      description: 'Criar interface completa para gerenciar tarefas',
      priority: 'high',
      status: 'in_progress',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      categoryId: '1',
      category: {
        id: '1',
        name: 'Desenvolvimento',
        color: '#6366f1'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Revisar documentação',
      description: 'Atualizar documentação do projeto',
      priority: 'medium',
      status: 'pending',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      categoryId: '2',
      category: {
        id: '2',
        name: 'Documentação',
        color: '#10b981'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '3',
      title: 'Deploy da aplicação',
      description: 'Fazer deploy em produção',
      priority: 'urgent',
      status: 'completed',
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      categoryId: '1',
      category: {
        id: '1',
        name: 'Desenvolvimento',
        color: '#6366f1'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  categories: [
    {
      id: '1',
      name: 'Desenvolvimento',
      description: 'Tarefas relacionadas ao desenvolvimento de software',
      color: '#6366f1',
      tasksCount: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Documentação',
      description: 'Tarefas de documentação e escrita',
      color: '#10b981',
      tasksCount: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '3',
      name: 'Design',
      description: 'Tarefas de design e UX/UI',
      color: '#f59e0b',
      tasksCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]
}

export const setupMockApi = () => {
  // Interceptar requests para API de tarefas
  axios.interceptors.request.use((config) => {
    const url = config.url
    const method = config.method.toLowerCase()
    
    console.log(`Mock API: ${method.toUpperCase()} ${url}`)

    // Simular delay de rede
    return new Promise((resolve) => {
      setTimeout(() => resolve(config), 300)
    })
  })

  axios.interceptors.response.use((response) => {
    // Se já tem resposta (request real), retorna
    if (response.status === 200 && response.data) {
      return response
    }

    const config = response.config
    const requestUrl = config.url
    const requestMethod = config.method.toLowerCase()

    // Mock responses
    let mockResponse = null
    
    // Tarefas
    if (requestUrl.includes('/api/tasks')) {
      if (requestMethod === 'get' && !requestUrl.includes('/api/tasks/')) {
        mockResponse = {
          data: {
            success: true,
            data: {
              tasks: mockData.tasks,
              pagination: {
                page: 1,
                limit: 10,
                total: mockData.tasks.length,
                totalPages: 1
              }
            }
          }
        }
      }
      
      if (requestMethod === 'get' && requestUrl.includes('/api/tasks/stats')) {
        mockResponse = {
          data: {
            success: true,
            data: {
              total: mockData.tasks.length,
              pending: mockData.tasks.filter(t => t.status === 'pending').length,
              inProgress: mockData.tasks.filter(t => t.status === 'in_progress').length,
              completed: mockData.tasks.filter(t => t.status === 'completed').length,
              overdue: mockData.tasks.filter(t => t.status === 'overdue').length
            }
          }
        }
      }

      if (requestMethod === 'post') {
        const newTask = {
          id: String(Date.now()),
          ...config.data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        mockData.tasks.unshift(newTask)
        mockResponse = {
          data: {
            success: true,
            data: newTask
          }
        }
      }

      if (requestMethod === 'put') {
        const taskId = requestUrl.split('/').pop()
        const taskIndex = mockData.tasks.findIndex(t => t.id === taskId)
        if (taskIndex !== -1) {
          mockData.tasks[taskIndex] = {
            ...mockData.tasks[taskIndex],
            ...config.data,
            updatedAt: new Date().toISOString()
          }
          mockResponse = {
            data: {
              success: true,
              data: mockData.tasks[taskIndex]
            }
          }
        }
      }

      if (requestMethod === 'delete') {
        const taskId = requestUrl.split('/').pop()
        mockData.tasks = mockData.tasks.filter(t => t.id !== taskId)
        mockResponse = {
          data: {
            success: true,
            message: 'Tarefa excluída com sucesso'
          }
        }
      }

      if (requestMethod === 'patch' && requestUrl.includes('/status')) {
        const taskId = requestUrl.split('/')[3]
        const taskIndex = mockData.tasks.findIndex(t => t.id === taskId)
        if (taskIndex !== -1) {
          mockData.tasks[taskIndex].status = config.data.status
          mockData.tasks[taskIndex].updatedAt = new Date().toISOString()
          mockResponse = {
            data: {
              success: true,
              data: mockData.tasks[taskIndex]
            }
          }
        }
      }

      if (requestMethod === 'patch' && requestUrl.includes('/priority')) {
        const taskId = requestUrl.split('/')[3]
        const taskIndex = mockData.tasks.findIndex(t => t.id === taskId)
        if (taskIndex !== -1) {
          mockData.tasks[taskIndex].priority = config.data.priority
          mockData.tasks[taskIndex].updatedAt = new Date().toISOString()
          mockResponse = {
            data: {
              success: true,
              data: mockData.tasks[taskIndex]
            }
          }
        }
      }
    }

    // Categorias
    if (requestUrl.includes('/api/categories')) {
      if (requestMethod === 'get' && !requestUrl.includes('/api/categories/')) {
        mockResponse = {
          data: {
            success: true,
            data: {
              categories: mockData.categories,
              pagination: {
                page: 1,
                limit: 10,
                total: mockData.categories.length,
                totalPages: 1
              }
            }
          }
        }
      }

      if (requestMethod === 'get' && requestUrl.includes('/with-stats')) {
        mockResponse = {
          data: {
            success: true,
            data: {
              categories: mockData.categories,
              pagination: {
                page: 1,
                limit: 10,
                total: mockData.categories.length,
                totalPages: 1
              }
            }
          }
        }
      }

      if (requestMethod === 'post') {
        const newCategory = {
          id: String(Date.now()),
          ...config.data,
          tasksCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        mockData.categories.unshift(newCategory)
        mockResponse = {
          data: {
            success: true,
            data: newCategory
          }
        }
      }

      if (requestMethod === 'put') {
        const categoryId = requestUrl.split('/').pop()
        const categoryIndex = mockData.categories.findIndex(c => c.id === categoryId)
        if (categoryIndex !== -1) {
          mockData.categories[categoryIndex] = {
            ...mockData.categories[categoryIndex],
            ...config.data,
            updatedAt: new Date().toISOString()
          }
          mockResponse = {
            data: {
              success: true,
              data: mockData.categories[categoryIndex]
            }
          }
        }
      }

      if (requestMethod === 'delete') {
        const categoryId = requestUrl.split('/').pop()
        mockData.categories = mockData.categories.filter(c => c.id !== categoryId)
        mockResponse = {
          data: {
            success: true,
            message: 'Categoria excluída com sucesso'
          }
        }
      }
    }

    // Se encontrou um mock response, retorna ele
    if (mockResponse) {
      return Promise.resolve({
        ...response,
        ...mockResponse,
        status: 200,
        statusText: 'OK'
      })
    }

    return response
  }, (error) => {
    return Promise.reject(error)
  })
}
