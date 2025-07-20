// Mock API interceptor para desenvolvimento local
import axios from 'axios'

const mockData = {
  users: [
    {
      id: '1',
      name: 'João Silva',
      email: 'joao@email.com',
      avatar: '/avatars/joao.jpg'
    },
    {
      id: '2',
      name: 'Maria Santos',
      email: 'maria@email.com',
      avatar: '/avatars/maria.jpg'
    },
    {
      id: '3',
      name: 'Pedro Costa',
      email: 'pedro@email.com',
      avatar: '/avatars/pedro.jpg'
    },
    {
      id: '4',
      name: 'Ana Silva',
      email: 'ana@email.com',
      avatar: '/avatars/ana.jpg'
    }
  ],
  tasks: [
    {
      id: '1',
      title: 'Implementar CRUD de tarefas',
      description: 'Criar interface completa para gerenciar tarefas',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      categoryId: '1',
      category: {
        id: '1',
        name: 'Desenvolvimento',
        color: '#6366f1'
      },
      owner: {
        id: '1',
        name: 'João Silva',
        email: 'joao@email.com'
      },
      assignee: {
        id: '2',
        name: 'Maria Santos',
        email: 'maria@email.com'
      },
      collaborators: [
        {
          id: '1',
          name: 'João Silva',
          email: 'joao@email.com',
          role: 'OWNER'
        },
        {
          id: '2',
          name: 'Maria Santos',
          email: 'maria@email.com',
          role: 'EDITOR'
        },
        {
          id: '3',
          name: 'Pedro Costa',
          email: 'pedro@email.com',
          role: 'VIEWER'
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Revisar documentação',
      description: 'Atualizar documentação do projeto',
      priority: 'MEDIUM',
      status: 'PENDING',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      categoryId: '2',
      category: {
        id: '2',
        name: 'Documentação',
        color: '#10b981'
      },
      owner: {
        id: '2',
        name: 'Maria Santos',
        email: 'maria@email.com'
      },
      assignee: null,
      collaborators: [
        {
          id: '2',
          name: 'Maria Santos',
          email: 'maria@email.com',
          role: 'OWNER'
        },
        {
          id: '4',
          name: 'Ana Silva',
          email: 'ana@email.com',
          role: 'ADMIN'
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '3',
      title: 'Deploy da aplicação',
      description: 'Fazer deploy em produção',
      priority: 'URGENT',
      status: 'COMPLETED',
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      categoryId: '1',
      category: {
        id: '1',
        name: 'Desenvolvimento',
        color: '#6366f1'
      },
      owner: {
        id: '1',
        name: 'João Silva',
        email: 'joao@email.com'
      },
      assignee: {
        id: '1',
        name: 'João Silva',
        email: 'joao@email.com'
      },
      collaborators: [
        {
          id: '1',
          name: 'João Silva',
          email: 'joao@email.com',
          role: 'OWNER'
        }
      ],
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

// Helper functions for collaboration
const findTaskById = (taskId) => mockData.tasks.find(t => t.id === taskId)
const findUserById = (userId) => mockData.users.find(u => u.id === userId)

const calculateUserPermissions = (userId, task) => {
  if (!task || !userId) return null
  
  const collaborator = task.collaborators.find(c => c.id === userId)
  if (!collaborator) return null
  
  const role = collaborator.role
  
  return {
    canView: true,
    canEdit: ['OWNER', 'ADMIN', 'EDITOR'].includes(role),
    canDelete: ['OWNER', 'ADMIN'].includes(role),
    canManageCollaborators: ['OWNER', 'ADMIN'].includes(role),
    canAssignTasks: ['OWNER', 'ADMIN', 'EDITOR'].includes(role),
    role
  }
}

export const setupMockApi = () => {
  console.log('🚀 Mock API Initialized')
  
  axios.interceptors.response.use(
    (response) => {
      const requestUrl = response.config.url || ''
      const requestMethod = response.config.method?.toLowerCase() || 'get'

      let mockResponse = null

      // Tasks endpoints
      if (requestUrl.includes('/tasks')) {
        if (requestMethod === 'get' && !requestUrl.includes('/tasks/')) {
          mockResponse = {
            data: {
              success: true,
              data: {
                tasks: mockData.tasks,
                pagination: { page: 1, limit: 10, total: mockData.tasks.length, totalPages: 1 }
              }
            }
          }
        } else if (requestMethod === 'get' && requestUrl.match(/\/tasks\/[^\/]+$/)) {
          const taskId = requestUrl.split('/').pop()
          const task = findTaskById(taskId)
          if (task) {
            mockResponse = {
              data: {
                success: true,
                data: task
              }
            }
          }
        } else if (requestMethod === 'post' && requestUrl.endsWith('/tasks')) {
          const requestData = JSON.parse(response.config.data || '{}')
          const newTask = {
            id: Date.now().toString(),
            ...requestData,
            owner: mockData.users[0],
            collaborators: [{ ...mockData.users[0], role: 'OWNER' }],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
          mockData.tasks.push(newTask)
          mockResponse = {
            data: {
              success: true,
              data: newTask
            }
          }
        } else if (requestMethod === 'put' && requestUrl.match(/\/tasks\/[^\/]+$/)) {
          const taskId = requestUrl.split('/').pop()
          const taskIndex = mockData.tasks.findIndex(t => t.id === taskId)
          if (taskIndex !== -1) {
            const requestData = JSON.parse(response.config.data || '{}')
            mockData.tasks[taskIndex] = {
              ...mockData.tasks[taskIndex],
              ...requestData,
              updatedAt: new Date().toISOString()
            }
            mockResponse = {
              data: {
                success: true,
                data: mockData.tasks[taskIndex]
              }
            }
          }
        } else if (requestMethod === 'delete' && requestUrl.match(/\/tasks\/[^\/]+$/)) {
          const taskId = requestUrl.split('/').pop()
          const taskIndex = mockData.tasks.findIndex(t => t.id === taskId)
          if (taskIndex !== -1) {
            mockData.tasks.splice(taskIndex, 1)
            mockResponse = {
              data: {
                success: true,
                message: 'Task deleted successfully'
              }
            }
          }
        }
        
        // Collaboration endpoints
        else if (requestMethod === 'post' && requestUrl.match(/\/tasks\/[^\/]+\/collaborators$/)) {
          const taskId = requestUrl.split('/')[2]
          const task = findTaskById(taskId)
          const requestData = JSON.parse(response.config.data || '{}')
          
          if (task && requestData.userId && requestData.role) {
            const user = findUserById(requestData.userId)
            if (user && !task.collaborators.find(c => c.id === user.id)) {
              task.collaborators.push({
                id: user.id,
                name: user.name,
                email: user.email,
                role: requestData.role
              })
              task.updatedAt = new Date().toISOString()
              
              mockResponse = {
                data: {
                  success: true,
                  data: task
                }
              }
            }
          }
        } else if (requestMethod === 'delete' && requestUrl.match(/\/tasks\/[^\/]+\/collaborators\/[^\/]+$/)) {
          const [, , taskId, , userId] = requestUrl.split('/')
          const task = findTaskById(taskId)
          
          if (task) {
            const collaboratorIndex = task.collaborators.findIndex(c => c.id === userId)
            if (collaboratorIndex !== -1 && task.collaborators[collaboratorIndex].role !== 'OWNER') {
              task.collaborators.splice(collaboratorIndex, 1)
              task.updatedAt = new Date().toISOString()
              
              mockResponse = {
                data: {
                  success: true,
                  data: task
                }
              }
            }
          }
        } else if (requestMethod === 'post' && requestUrl.match(/\/tasks\/[^\/]+\/assign$/)) {
          const taskId = requestUrl.split('/')[2]
          const task = findTaskById(taskId)
          const requestData = JSON.parse(response.config.data || '{}')
          
          if (task && requestData.userId) {
            const user = findUserById(requestData.userId)
            if (user && task.collaborators.find(c => c.id === user.id)) {
              task.assignee = {
                id: user.id,
                name: user.name,
                email: user.email
              }
              task.updatedAt = new Date().toISOString()
              
              mockResponse = {
                data: {
                  success: true,
                  data: task
                }
              }
            }
          }
        } else if (requestMethod === 'delete' && requestUrl.match(/\/tasks\/[^\/]+\/assign$/)) {
          const taskId = requestUrl.split('/')[2]
          const task = findTaskById(taskId)
          
          if (task) {
            task.assignee = null
            task.updatedAt = new Date().toISOString()
            
            mockResponse = {
              data: {
                success: true,
                data: task
              }
            }
          }
        } else if (requestMethod === 'get' && requestUrl.match(/\/tasks\/[^\/]+\/permissions\/[^\/]+$/)) {
          const [, , taskId, , userId] = requestUrl.split('/')
          const task = findTaskById(taskId)
          
          if (task) {
            const permissions = calculateUserPermissions(userId, task)
            mockResponse = {
              data: {
                success: true,
                data: permissions
              }
            }
          }
        }
      }

      // Categories endpoints  
      if (requestUrl.includes('/categories')) {
        if (requestMethod === 'get') {
          mockResponse = {
            data: {
              success: true,
              data: {
                categories: mockData.categories,
                pagination: { page: 1, limit: 10, total: mockData.categories.length, totalPages: 1 }
              }
            }
          }
        }
      }

      // Users endpoints
      if (requestUrl.includes('/users')) {
        if (requestMethod === 'get') {
          mockResponse = {
            data: {
              success: true,
              data: {
                users: mockData.users,
                pagination: { page: 1, limit: 10, total: mockData.users.length, totalPages: 1 }
              }
            }
          }
        }
      }

      if (mockResponse) {
        console.log('✅ Mock response:', mockResponse)
        return Promise.resolve({ ...response, ...mockResponse, status: 200, statusText: 'OK' })
      }

      return response
    },
    (error) => Promise.reject(error)
  )
}
