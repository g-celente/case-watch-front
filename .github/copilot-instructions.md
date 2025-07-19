<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# TaskManager Application

Este é um projeto Vue 3 de gerenciamento de tarefas com as seguintes características:

## Tecnologias
- Vue 3 com Composition API
- Tailwind CSS v3 para estilização
- Componentes baseados em Shadcn-vue (cores brancas e roxas)
- Vue Router para roteamento
- Pinia para gerenciamento de estado
- Axios para requisições HTTP
- Sem TypeScript e sem ESLint

## Estrutura do Projeto
- `/src/api/` - Configuração do Axios e serviços da API
- `/src/stores/` - Stores do Pinia para gerenciamento de estado
- `/src/views/` - Páginas principais (Login, Register, Dashboard)
- `/src/components/` - Componentes reutilizáveis
- `/src/router/` - Configuração de rotas com proteção de autenticação

## Padrões de Código
- Use sempre Composition API com `<script setup>`
- Componentes em PascalCase
- Props e eventos bem definidos
- Classes CSS usando sistema de design Shadcn-vue
- Estado reativo com ref() e computed()

## API Integration
- Base URL configurada em `/src/api/index.js`
- Interceptors para autenticação automática com JWT
- Serviços organizados por módulo (auth, tasks, etc.)
- Tratamento de erros centralizado

## Autenticação
- JWT armazenado em localStorage
- Proteção de rotas via router guards
- Auto-refresh de token quando expira
- Store persistido com pinia-plugin-persistedstate
