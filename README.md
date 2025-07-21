# TaskManager - Aplicação de Gerenciamento de Tarefas

Uma aplicação Vue 3 completa e moderna para gerenciamento de tarefas colaborativas com autenticação JWT, interface responsiva e integração com API REST.

## 🎯 Objetivo do Projeto

O TaskManager é uma aplicação web desenvolvida para facilitar o gerenciamento de tarefas em equipes, permitindo colaboração eficiente com diferentes níveis de permissão. O sistema oferece uma interface intuitiva e moderna, com recursos avançados de categorização, priorização e acompanhamento de atividades.

## 🚀 Tecnologias

- **Vue 3**: Framework principal utilizando Composition API
- **Tailwind CSS v3**: Framework CSS para estilização responsiva
- **Shadcn-vue**: Componentes acessíveis e modernos com design system consistente
- **Vue Router**: Gerenciamento de rotas com proteção baseada em autenticação
- **Pinia**: Gerenciamento de estado com persistência
- **Axios**: Cliente HTTP para integração com API
- **VueUse**: Coleção de composables Vue para funcionalidades comuns
- **Lucide Vue Next**: Biblioteca de ícones moderna e consistente

## ✨ Funcionalidades

### 🔐 Autenticação e Perfil de Usuário
- Sistema completo de login e registro de usuários
- Autenticação JWT com auto-refresh e interceptors
- Proteção de rotas baseada em permissões
- Persistência de sessão com pinia-plugin-persistedstate
- Perfil de usuário com edição de dados pessoais
- Upload e gerenciamento de foto de perfil
- Alteração de senha com validação de segurança
- Estatísticas de atividades do usuário
- Histórico de ações no sistema

### 📊 Dashboard
- Visão geral das tarefas pendentes e concluídas
- Estatísticas em tempo real de produtividade
- Acesso rápido a tarefas recentes
- Indicadores de progresso por categoria
- Alertas para tarefas com prazo próximo
- Cards interativos com ações rápidas
- Modo escuro adaptativo

### ✅ Gerenciamento de Tarefas
- CRUD completo de tarefas com validação de formulários
- Sistema avançado de filtros e paginação
- Categorização com código de cores personalizáveis
- Definição de prioridade e status com indicadores visuais
- Sistema de colaboração entre usuários
- Comentários e histórico de alterações
- Diferentes visualizações (lista, cards, kanban)
- Busca avançada com múltiplos parâmetros

### � Sistema de Colaboração
- Múltiplos colaboradores por tarefa
- Sistema de permissões com 4 níveis (OWNER, ADMIN, EDITOR, VIEWER)
- Atribuição de tarefas a colaboradores específicos
- Indicadores visuais de colaboradores e suas funções
- Matriz de permissões visual
- Notificações de alterações para colaboradores

### 📈 Relatórios e Análises
- Gráficos interativos de produtividade
- Estatísticas detalhadas por categoria e status
- Análise de performance do usuário
- Relatórios de atividades e conclusão de tarefas
- Exportação de dados em diferentes formatos
- Filtros temporais (diário, semanal, mensal, personalizado)

## 🛠️ Instalação e Execução

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Instalação
```bash
# Clonar o repositório
git clone https://github.com/g-celente/case-watch-front.git
cd front-case-watch

# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da versão de produção
npm run preview
```

### Configuração da API
Edite o arquivo `src/api/index.js` e altere a `baseURL` para a URL da sua API:

```javascript
const baseURL = "http://localhost:3056/api/"; // Altere para sua API
const httpClient = axios.create({ baseURL });
```

### Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```
VITE_API_URL=http://localhost:3056/api
VITE_APP_NAME=TaskManager
```

## 📁 Estrutura do Projeto

```
src/
├── api/                      # Configuração do Axios e serviços
│   ├── index.js              # Configuração principal + interceptors
│   └── services/             # Serviços organizados por módulo
│       ├── auth.js           # Serviços de autenticação
│       ├── tasks.js          # Serviços de tarefas
│       ├── categories.js     # Serviços de categorias
│       └── reports.js        # Serviços de relatórios
│
├── assets/                   # Arquivos estáticos
│   └── globals.css           # Estilos globais + variáveis CSS
│
├── components/               # Componentes reutilizáveis
│   ├── alert/                # Componentes de alerta
│   ├── category/             # Componentes de categorias
│   ├── charts/               # Componentes de gráficos
│   ├── colaboration/         # Componentes de colaboração
│   ├── profile/              # Componentes de perfil
│   │   ├── ProfileActivities.vue  # Histórico de atividades
│   │   ├── ProfileEdit.vue        # Edição de perfil
│   │   ├── ProfileHeader.vue      # Cabeçalho com foto e dados
│   │   ├── ProfilePassword.vue    # Alteração de senha
│   │   └── ProfileStats.vue       # Estatísticas do usuário
│   ├── reports/              # Componentes de relatórios
│   ├── task/                 # Componentes de tarefas
│   ├── ui/                   # Componentes base (shadcn-vue)
│   ├── user/                 # Componentes de usuário
│   ├── Sidebar.vue           # Barra lateral de navegação
│   ├── TheContainer.vue      # Layout principal
│   └── ToastContainer.vue    # Container de notificações
│
├── composables/              # Composables Vue reutilizáveis
│   └── useToast.js           # Sistema de notificações toast
│
├── lib/                      # Utilitários e helpers
│   └── utils.js              # Funções auxiliares (cn, formatters, etc)
│
├── router/                   # Configuração de rotas
│   ├── index.js              # Definição de rotas
│   └── beforeEach.js         # Guards de autenticação
│
├── stores/                   # Stores Pinia
│   ├── auth/                 # Store de autenticação
│   │   └── auth.js           # Gerenciamento de usuários e autenticação
│   ├── tasks.js              # Store de tarefas
│   ├── categories.js         # Store de categorias
│   └── reports.js            # Store de relatórios
│
└── views/                    # Páginas principais
    ├── auth/                 # Páginas de autenticação
    │   ├── LoginView.vue     # Página de login
    │   └── RegisterView.vue  # Página de registro
    ├── CategoriesView.vue    # Gerenciamento de categorias
    ├── DashboardView.vue     # Dashboard principal
    ├── ProfileView.vue       # Perfil do usuário
    ├── ReportsView.vue       # Relatórios e estatísticas
    ├── TasksView.vue         # Gerenciamento de tarefas
    └── UsersView.vue         # Gerenciamento de usuários
```

## 🎨 Design System

A aplicação utiliza um sistema de design baseado em **Shadcn-vue** com estilização via Tailwind CSS:

### Esquema de Cores
- **Cores primárias**: Roxo/Violeta (`--primary: 108 99 255`)
- **Background**: Branco (`--background: 255 255 255`)
- **Foreground**: Preto escuro (`--foreground: 15 23 42`)
- **Cores de status**: 
  - Sucesso: Verde (`#10b981`)
  - Alerta: Amarelo (`#f59e0b`)
  - Erro: Vermelho (`#ef4444`)
  - Info: Azul (`#3b82f6`)

### Componentes Base
- **Button**: Botões com diferentes variantes (default, destructive, outline, ghost)
- **Card**: Cartões com header, content e footer
- **Input**: Campos de entrada com estilos consistentes
- **Label**: Rótulos para formulários
- **Dialog**: Modais e diálogos de confirmação
- **Toast**: Sistema de notificações temporárias

### Responsividade
- Design mobile-first com breakpoints responsivos
- Grid system flexível com Tailwind CSS
- Adaptação automática para diferentes tamanhos de tela
- Sidebar colapsável em dispositivos móveis

### Acessibilidade
- Contraste adequado para leitura
- Navegação por teclado
- Estados de foco visíveis
- Labels e ARIA attributes para screen readers

### Variáveis CSS Personalizáveis
```css
@layer base {
  :root {
    --background: 255 255 255;    /* Branco */
    --foreground: 15 23 42;       /* Preto escuro */
    --card: 255 255 255;
    --card-foreground: 15 23 42;
    --popover: 255 255 255;
    --popover-foreground: 15 23 42;
    --primary: 108 99 255;        /* Roxo */
    --primary-foreground: 255 255 255;
    --secondary: 248 250 252;     /* Cinza muito claro */
    --secondary-foreground: 15 23 42;
    --muted: 241 245 249;
    --muted-foreground: 100 116 139;
    --accent: 241 245 249;
    /* ... mais variáveis em globals.css */
  }
}
```

## 🔒 Autenticação e Segurança

### Fluxo de Autenticação
1. **Login/Registro**: O usuário faz login ou se registra na aplicação
2. **Recebimento de JWT**: Backend retorna token JWT após validação
3. **Armazenamento**: Token é armazenado em `localStorage` e Pinia store
4. **Interceptors**: O interceptor Axios adiciona token em todas as requisições
5. **Auto-refresh**: Sistema automático de renovação quando token expira
6. **Logout**: Remoção do token e redirecionamento para login

### Proteção de Rotas
O Vue Router utiliza guards para proteger rotas que exigem autenticação:

```javascript
// src/router/beforeEach.js
export default async (to) => {
  const token = localStorage.getItem("token");

  // Redireciona para o home se estiver logado e tentar acessar a página de login
  if (to.name === "login" && token) {
    return { name: "dashboard" };
  }

  // Verifica se a rota exige autenticação
  if (to.meta.requiresAuth) {
    if (!token) {
      return { name: "login" };
    }
    return true;
  }

  return true;
};
```

### Persistência de Estado
O estado de autenticação é persistido usando `pinia-plugin-persistedstate`:

```javascript
// Configuração da persistência no store
export const useAuthStore = defineStore('auth', () => {
  // Estado persistido
  const user = ref(localStorage.getItem('user') 
    ? JSON.parse(localStorage.getItem('user')) 
    : null
  )
  const token = ref(localStorage.getItem('token'))
  
  // ...ações e getters
})
```

### Interceptors Axios
Configuração de interceptors para adicionar tokens e tratar erros:

```javascript
httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Tratamento de erros 401, refresh token, etc.
  }
);
```

## 📡 Integração com API

### Estrutura de Serviços
A aplicação organiza a comunicação com a API em serviços especializados:

```javascript
// src/api/index.js
export default {
  auth: AuthService(httpClient),       // Autenticação e usuários
  categories: CategoriesService(httpClient),  // Categorias
  tasks: TasksService(httpClient),     // Tarefas
  reports: ReportsService(httpClient), // Relatórios
};
```

### Serviços Implementados

#### Autenticação
```javascript
// src/api/services/auth.js
export default (httpClient) => ({
  login: (data) => httpClient.post('/auth/login', data),
  register: (data) => httpClient.post('/auth/register', data),
  logout: () => httpClient.post('/auth/logout'),
  getProfile: () => httpClient.get('/auth/profile'),
  updateProfile: (data) => httpClient.put('/auth/profile', data),
  changePassword: (data) => httpClient.post('/auth/change-password', data),
  refreshToken: () => httpClient.post('/auth/refresh'),
  getUserStats: () => httpClient.get('/auth/stats'),
  getUserActivities: (params) => httpClient.get('/auth/activities', {params}),
  uploadProfilePhoto: (formData) => httpClient.post('/auth/profile/photo', formData),
  // ...outros métodos
})
```

#### Tarefas
```javascript
// src/api/services/tasks.js
export default (httpClient) => ({
  getTasks: (params) => httpClient.get('/tasks', {params}),
  getTask: (id) => httpClient.get(`/tasks/${id}`),
  createTask: (data) => httpClient.post('/tasks', data),
  updateTask: (id, data) => httpClient.put(`/tasks/${id}`, data),
  deleteTask: (id) => httpClient.delete(`/tasks/${id}`),
  updateStatus: (id, status) => httpClient.patch(`/tasks/${id}/status`, {status}),
  addCollaborator: (id, data) => httpClient.post(`/tasks/${id}/collaborators`, data),
  removeCollaborator: (id, userId) => httpClient.delete(`/tasks/${id}/collaborators/${userId}`),
  // ...outros métodos
})
```

### Formato de Resposta da API
A API segue um formato consistente para todas as respostas:

```json
{
  "success": true,
  "message": "Operação realizada com sucesso",
  "data": {
    // Dados específicos da resposta
  },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### Tratamento de Erros
Sistema centralizado de tratamento de erros:

```javascript
httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Tratamento padrão para erros comuns
    if (error.response) {
      switch (error.response.status) {
        case 401: // Não autorizado
          // Lógica de refresh token ou redirecionamento
          break;
        case 403: // Proibido
          // Notificação de permissão insuficiente
          break;
        // ...outros status codes
      }
    }
    return Promise.reject(error);
  }
);
```

## � Sistema de Colaboração

### Níveis de Permissão

#### 🔑 OWNER (Proprietário)
- Controle total sobre a tarefa
- Pode gerenciar todos os colaboradores (adicionar/remover)
- Pode editar, excluir e atribuir tarefas
- Único com poder de transferir propriedade

#### 👤 ADMIN (Administrador)  
- Pode gerenciar colaboradores (adicionar/remover)
- Pode editar e excluir tarefas
- Pode atribuir tarefas a outros colaboradores
- Não pode remover o OWNER

#### ✏️ EDITOR (Editor)
- Pode editar conteúdo das tarefas
- Pode atribuir tarefas (incluindo para si mesmo)
- Pode visualizar todos os detalhes
- Não pode gerenciar colaboradores

#### 👁️ VIEWER (Visualizador)
- Apenas visualização das tarefas
- Pode ver detalhes e comentários
- Não pode fazer alterações
- Acesso somente leitura

### Componentes de Colaboração

#### CollaborationPanel
Painel completo para gerenciar colaboradores em uma tarefa:
- Lista de colaboradores atuais com seus papéis
- Interface para adicionar novos colaboradores
- Seletor de papel (role) com descrições
- Opções para remover colaboradores (baseado em permissão)

#### TaskCard
Cartão de tarefa com indicadores de colaboração:
- Avatar do criador da tarefa
- Indicador de quantidade de colaboradores
- Tooltip com lista de colaboradores
- Ações disponíveis baseadas na permissão do usuário

#### TaskDetail
Visualização detalhada com controles baseados em permissão:
- Exibição de todos os colaboradores
- Histórico de atividades na tarefa
- Controles de edição condicionais
- Sistema de comentários

### Funcionalidades Técnicas

#### Operações de Colaboração
- `addCollaborator`: Adicionar colaborador com função específica
- `removeCollaborator`: Remover colaborador (respeitando hierarquia)
- `assignTask`: Atribuir tarefa a colaborador específico
- `unassignTask`: Remover atribuição de tarefa
- `calculateUserPermissions`: Calcular permissões baseadas na função

#### Indicadores Visuais
- Avatares coloridos para colaboradores
- Badges de função com cores específicas:
  - OWNER: Roxo (#8b5cf6)
  - ADMIN: Azul (#3b82f6)
  - EDITOR: Verde (#10b981)
  - VIEWER: Cinza (#6b7280)
- Contadores quando há muitos colaboradores
- Estados visuais baseados em permissões

## 📱 Perfil de Usuário

A seção de perfil do usuário oferece funcionalidades completas para gerenciamento de dados pessoais:

### Componentes do Perfil

#### ProfileHeader
- Exibe dados básicos do usuário (nome, email, data de registro)
- Permite upload e gerenciamento de foto de perfil
- Indicadores visuais de atividade e status
- Botão para edição rápida de perfil

#### ProfileEdit
- Formulário para atualização de dados pessoais
- Validação em tempo real dos campos
- Preview de alterações antes de salvar
- Mensagens de sucesso/erro após operações

#### ProfilePassword
- Formulário dedicado para alteração de senha
- Validação de força de senha com indicadores visuais
- Verificação de senha atual para segurança
- Regras de segurança com feedback visual:
  - Mínimo de 8 caracteres
  - Letras maiúsculas e minúsculas
  - Números
  - Caracteres especiais

#### ProfileStats
- Cards com estatísticas do usuário
- Contador de tarefas criadas
- Indicador de taxa de conclusão
- Métricas de produtividade
- Evolução temporal de atividades

#### ProfileActivities
- Timeline de atividades recentes do usuário
- Ícones específicos para cada tipo de atividade
- Formatação relativa de tempo (há X minutos/horas)
- Filtros por tipo de atividade
- Paginação para histórico mais antigo

### Gerenciamento de Foto de Perfil
```javascript
// Exemplo de upload de foto no ProfileHeader
const handleFileChange = async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  
  try {
    const formData = new FormData();
    formData.append('photo', file);
    
    await authStore.uploadProfilePhoto(formData);
    showToast({
      type: 'success',
      message: 'Foto de perfil atualizada com sucesso!'
    });
  } catch (error) {
    showToast({
      type: 'error',
      message: 'Erro ao atualizar foto de perfil.'
    });
  }
};
```

## � Próximos Passos

- [ ] Implementar módulo de notificações em tempo real
- [ ] Adicionar opção de exportação de relatórios em PDF/Excel
- [ ] Desenvolver visualização Kanban para tarefas
- [ ] Implementar sistema de templates de tarefas
- [ ] Criar sistema de tags para melhor categorização
- [ ] Adicionar funcionalidade de calendário integrado
- [ ] Implementar modo offline com sincronização posterior
- [ ] Adicionar testes unitários e E2E
- [ ] Melhorar a acessibilidade dos componentes
- [ ] Desenvolver versão PWA (Progressive Web App)
- [ ] Adicionar integração com serviços de calendário externos
- [ ] Implementar sistema de lembretes e alarmes

## 🤝 Contribuição

Para contribuir com o projeto:

1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### Diretrizes de Contribuição

- Siga o padrão de código existente
- Utilize a Composition API para componentes Vue
- Mantenha a compatibilidade com o design system
- Documente novas funcionalidades
- Adicione testes para novas features quando possível

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

**Desenvolvido com ❤️ usando Vue 3 + Tailwind CSS**
