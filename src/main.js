import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import router from './router'
import App from './App.vue'
import './assets/globals.css'

// Configurar mock API em desenvolvimento de forma mais robusta
async function setupDevelopmentEnvironment() {
  if (import.meta.env.DEV) {
    try {
      const mockModule = await import('./api/mock.js');
      if (mockModule && typeof mockModule.setupMockApi === 'function') {
        mockModule.setupMockApi();
        console.log('Mock API configurada com sucesso');
      } else {
        console.error('Função setupMockApi não encontrada no módulo');
      }
    } catch (error) {
      console.error('Erro ao configurar mock API:', error);
    }
  }
}

// Iniciar a aplicação após configurar o ambiente
async function bootstrap() {
  await setupDevelopmentEnvironment();
  
  const pinia = createPinia();
  pinia.use(piniaPluginPersistedstate);
  
  const app = createApp(App);
  app.use(pinia);
  app.use(router);
  app.mount('#app');
}

bootstrap();
