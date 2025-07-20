# TaskManager - Aplicação de Gerenciamento de Tarefas

Uma aplicação Vue 3 completa e moderna para gerenciamento de tarefas com autenticação JWT, interface responsiva e integração com API REST.

## 🚀 Tecnologias

- **Vue 3** com Composition API
- **Tailwind CSS v3** para estilização responsiva
- **Shadcn-vue** para componentes acessíveis e modernos
- **Vue Router** para roteamento com proteção de rotas
- **Pinia** para gerenciamento de estado
- **Axios** para requisições HTTP
- **VueUse** para utilitários reativos
- **Lucide Vue Next** para ícones

## ✨ Funcionalidades

### 🔐 Autenticação
- Login e registro de usuários
- JWT com auto-refresh
- Proteção de rotas
- Persistência de sessão

### 📊 Dashboard
- Visão geral das tarefas
- Estatísticas em tempo real
- Ações rápidas
- Modo escuro

### ✅ Gerenciamento de Tarefas (Em desenvolvimento)
- CRUD completo de tarefas
- Filtros e paginação
- Categorização
- Prioridades e status

### 📈 Relatórios (Em desenvolvimento)
- Gráficos de produtividade
- Estatísticas por categoria
- Performance do usuário

## 🛠️ Instalação e Execução

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Instalação
```bash
# Clonar o repositório
git clone <url-do-repositorio>
cd front-case-watch

# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Build para produção
npm run build
```

### Configuração da API
Edite o arquivo `src/api/index.js` e altere a `baseURL` para a URL da sua API:

```javascript
const api = axios.create({
  baseURL: 'https://sua-api.com', // Altere aqui
  timeout: 10000,
  // ...
})
```

## 📁 Estrutura do Projeto

```
src/
├── api/                    # Configuração do Axios e serviços
│   ├── index.js           # Configuração principal + interceptors
│   └── services/          # Serviços organizados por módulo
│       └── auth.js        # Serviços de autenticação
├── components/            # Componentes reutilizáveis
│   ├── ui/               # Componentes base (Button, Input, Card)
│   ├── Sidebar.vue       # Barra lateral de navegação
│   └── TheContainer.vue  # Layout principal
├── stores/               # Stores Pinia
│   └── auth.js          # Store de autenticação
├── views/               # Páginas principais
│   ├── LoginView.vue    # Página de login
│   ├── RegisterView.vue # Página de registro
│   └── DashboardView.vue # Dashboard principal
├── router/              # Configuração de rotas
│   └── index.js         # Rotas + guards de autenticação
├── lib/                 # Utilitários
│   └── utils.js         # Helpers (cn, clsx, etc.)
└── assets/              # Arquivos estáticos
    └── globals.css      # Estilos globais + variáveis CSS
```

## 🎨 Design System

A aplicação usa um sistema de design baseado em **Shadcn-vue** com:

- **Cores primárias**: Roxo/Violeta (`primary`)
- **Modo escuro**: Suporte completo via `@vueuse/core`
- **Componentes acessíveis**: Baseados em Radix-ui
- **Responsividade**: Mobile-first com Tailwind CSS

### Variáveis CSS Customizáveis

```css
:root {
  --primary: 262.1 83.3% 57.8%;    /* Roxo principal */
  --background: 0 0% 100%;         /* Fundo claro */
  --foreground: 222.2 84% 4.9%;    /* Texto principal */
  /* ... mais variáveis em globals.css */
}
```

## 🔒 Autenticação

### Fluxo de Autenticação
1. Login/Registro → Recebe JWT do backend
2. Token armazenado em `localStorage` + Pinia store
3. Interceptor Axios adiciona `Authorization: Bearer <token>`
4. Auto-refresh quando token expira
5. Redirecionamento automático se não autenticado

### Proteção de Rotas
```javascript
// Router guard automático
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})
```

## 📡 Integração com API

### Endpoints Implementados
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro
- `GET /api/auth/profile` - Perfil do usuário
- `POST /api/auth/refresh` - Renovar token
- `POST /api/auth/logout` - Logout

### Estrutura de Resposta Esperada
```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "data": {
    "user": {
      "id": "cm123...",
      "email": "usuario@exemplo.com",
      "name": "Nome do Usuário"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

## 🚀 Próximos Passos

- [ ] Implementar CRUD de tarefas
- [ ] Adicionar sistema de categorias
- [ ] Criar páginas de relatórios com gráficos
- [ ] Implementar filtros e paginação
- [ ] Adicionar notificações toast
- [ ] Implementar upload de avatar
- [ ] Adicionar testes unitários
- [ ] PWA (Progressive Web App)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

**Desenvolvido com ❤️ usando Vue 3 + Tailwind CSS**

# Sistema de Gerenciamento de Tarefas Colaborativas

Este é um frontend moderno e responsivo para gerenciamento de tarefas colaborativas, desenvolvido com Vue 3, que permite múltiplos usuários trabalharem juntos em tarefas com diferentes níveis de permissão.

## 🚀 Funcionalidades Principais

### Sistema de Colaboração
- **Múltiplos usuários**: Suporte para vários colaboradores por tarefa
- **Sistema de permissões**: 4 níveis hierárquicos (OWNER, ADMIN, EDITOR, VIEWER)
- **Atribuição de tarefas**: Capacidade de atribuir tarefas específicas a colaboradores
- **Indicadores visuais**: Avatares e badges para mostrar colaboradores e suas funções

### Níveis de Permissão

#### 🔑 OWNER (Proprietário)
- Controle total da tarefa
- Pode gerenciar todos os colaboradores
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

### Interface e Experiência do Usuário

#### Visualizações Flexíveis
- **Modo Tabela**: Lista detalhada com colunas organizadas
- **Modo Cards**: Visualização em cartões para melhor overview
- Alternância rápida entre modos com controles visuais

#### Componentes de Colaboração
- **CollaborationPanel**: Painel completo para gerenciar colaboradores
- **TaskCard**: Cartões de tarefa com indicadores de colaboração
- **TaskDetail**: Visualização detalhada com controles baseados em permissão
- **PermissionMatrix**: Matriz visual de permissões por função

#### Indicadores Visuais
- Avatares coloridos para colaboradores
- Badges de função com cores específicas
- Contadores quando há muitos colaboradores
- Estados visuais baseados em permissões

### Funcionalidades Técnicas

#### Stores (Pinia)
- **Auth Store**: Gerenciamento de usuários e autenticação
- **Tasks Store**: Operações CRUD de tarefas + colaboração
- **Categories Store**: Gerenciamento de categorias

#### API Mock Completa
- Endpoints para gerenciamento de colaboradores
- Simulação de permissões em tempo real
- Dados de teste com múltiplos usuários
- Interceptação automática de requisições

#### Operações de Colaboração
- `addCollaborator`: Adicionar colaborador com função específica
- `removeCollaborator`: Remover colaborador (respeitando hierarquia)
- `assignTask`: Atribuir tarefa a colaborador específico
- `unassignTask`: Remover atribuição de tarefa
- `calculateUserPermissions`: Calcular permissões baseadas na função

## 🛠️ Tecnologias Utilizadas

- **Vue 3**: Framework principal com Composition API
- **Pinia**: Gerenciamento de estado
- **Tailwind CSS**: Estilização responsiva
- **Lucide Icons**: Ícones modernos e consistentes
- **Vite**: Build tool e desenvolvimento

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── CollaborationPanel.vue    # Painel de gerenciamento de colaboradores
│   ├── TaskCard.vue              # Cartão de tarefa com colaboração
│   ├── TaskDetail.vue            # Detalhes da tarefa com permissões
│   ├── PermissionMatrix.vue      # Matriz visual de permissões
│   └── ui/                       # Componentes de interface base
├── stores/
│   ├── auth.js                   # Store de autenticação e usuários
│   ├── tasks.js                  # Store de tarefas com colaboração
│   └── categories.js             # Store de categorias
├── api/
│   ├── services.js               # Serviços da API
│   └── mock.js                   # API mock com colaboração
└── views/
    ├── TasksView.vue             # Lista de tarefas (tabela + cards)
    └── CategoriesView.vue        # Gerenciamento de categorias
```

## 🚦 Como Usar

### Executar o Projeto
```bash
npm install
npm run dev
```

### Testar Funcionalidades de Colaboração

1. **Visualizar Tarefas**
   - Acesse a página de tarefas
   - Alterne entre modo tabela e cards
   - Observe os indicadores de colaboradores

2. **Gerenciar Colaboradores**
   - Clique em uma tarefa para abrir detalhes
   - Use o painel de colaboração para adicionar/remover usuários
   - Teste diferentes níveis de permissão

3. **Atribuir Tarefas**
   - No painel de colaboração, use o seletor de atribuição
   - Observe como as permissões controlam as opções disponíveis

4. **Testar Permissões**
   - Simule diferentes usuários alternando no sistema
   - Observe como a interface se adapta baseada nas permissões
   - Consulte a matriz de permissões para referência

### Dados de Teste
O sistema vem com usuários e tarefas pré-configurados:
- João Silva (ID: 1)
- Maria Santos (ID: 2) 
- Pedro Costa (ID: 3)
- Ana Silva (ID: 4)

## 🎨 Design System

### Cores de Função
- **OWNER**: Roxo (#8b5cf6)
- **ADMIN**: Azul (#3b82f6)
- **EDITOR**: Verde (#10b981)
- **VIEWER**: Cinza (#6b7280)

### Responsividade
- Mobile-first design
- Breakpoints responsivos para tablets e desktop
- Layout adaptativo para diferentes tamanhos de tela

## 🔧 Configurações

### Ambiente de Desenvolvimento
- O mock API está configurado para interceptar automaticamente
- Console logs habilitados para debug
- Hot reload ativo para desenvolvimento

### Personalização
- Cores e temas podem ser ajustados no Tailwind config
- Permissões podem ser modificadas no arquivo de stores
- Novos tipos de usuário podem ser adicionados facilmente

## 📈 Próximos Passos

- Integração com API real
- Sistema de notificações em tempo real
- Chat/comentários nas tarefas
- Histórico de atividades
- Busca avançada com filtros de colaborador
- Exportação de relatórios

## 🤝 Contribuição

Este projeto demonstra um sistema completo de colaboração em tarefas, com arquitetura escalável e interface moderna. O código está organizado para facilitar manutenção e extensão de funcionalidades.
