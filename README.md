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

Learn more about IDE Support for Vue in the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support).
