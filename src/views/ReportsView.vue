<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Relatórios</h1>
        <p class="mt-1 text-sm text-gray-500">
          Acesse diferentes tipos de relatórios e análises
        </p>
      </div>
    </div>

    <!-- Report Options Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Analytics Dashboard -->
      <div class="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer" @click="$router.push('/reports-dashboard')">
        <div class="flex items-center mb-4">
          <div class="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
            <BarChart3 class="h-6 w-6 text-purple-600" />
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-medium text-gray-900">Dashboard Analytics</h3>
            <p class="text-sm text-gray-500">Visão geral com gráficos interativos</p>
          </div>
        </div>
        <p class="text-gray-600 text-sm">
          Acesse um dashboard completo com métricas, gráficos interativos e análises detalhadas de produtividade.
        </p>
        <div class="mt-4 flex items-center text-purple-600 text-sm font-medium">
          <span>Acessar Dashboard</span>
          <ArrowRight class="h-4 w-4 ml-1" />
        </div>
      </div>

      <!-- Tasks Report -->
      <div class="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer opacity-50">
        <div class="flex items-center mb-4">
          <div class="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
            <FileText class="h-6 w-6 text-blue-600" />
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-medium text-gray-900">Relatório de Tarefas</h3>
            <p class="text-sm text-gray-500">Análise detalhada das tarefas</p>
          </div>
        </div>
        <p class="text-gray-600 text-sm">
          Relatório completo com status, prazos e análise de performance das tarefas do sistema.
        </p>
        <div class="mt-4 flex items-center text-gray-400 text-sm font-medium">
          <span>Em breve</span>
        </div>
      </div>

      <!-- User Performance -->
      <div class="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer opacity-50">
        <div class="flex items-center mb-4">
          <div class="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
            <Users class="h-6 w-6 text-green-600" />
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-medium text-gray-900">Performance de Usuários</h3>
            <p class="text-sm text-gray-500">Análise de produtividade individual</p>
          </div>
        </div>
        <p class="text-gray-600 text-sm">
          Relatório detalhado da performance individual dos usuários com métricas de produtividade.
        </p>
        <div class="mt-4 flex items-center text-gray-400 text-sm font-medium">
          <span>Em breve</span>
        </div>
      </div>

      <!-- Time Tracking -->
      <div class="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer opacity-50">
        <div class="flex items-center mb-4">
          <div class="h-12 w-12 rounded-lg bg-amber-100 flex items-center justify-center">
            <Clock class="h-6 w-6 text-amber-600" />
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-medium text-gray-900">Controle de Tempo</h3>
            <p class="text-sm text-gray-500">Análise de tempo gasto nas tarefas</p>
          </div>
        </div>
        <p class="text-gray-600 text-sm">
          Relatório de tempo dedicado às tarefas com análise de eficiência e produtividade.
        </p>
        <div class="mt-4 flex items-center text-gray-400 text-sm font-medium">
          <span>Em breve</span>
        </div>
      </div>

      <!-- Categories Analysis -->
      <div class="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer opacity-50">
        <div class="flex items-center mb-4">
          <div class="h-12 w-12 rounded-lg bg-indigo-100 flex items-center justify-center">
            <FolderOpen class="h-6 w-6 text-indigo-600" />
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-medium text-gray-900">Análise por Categoria</h3>
            <p class="text-sm text-gray-500">Performance por categorias</p>
          </div>
        </div>
        <p class="text-gray-600 text-sm">
          Análise detalhada do desempenho das tarefas organizadas por categorias do sistema.
        </p>
        <div class="mt-4 flex items-center text-gray-400 text-sm font-medium">
          <span>Em breve</span>
        </div>
      </div>

      <!-- Custom Reports -->
      <div class="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer opacity-50">
        <div class="flex items-center mb-4">
          <div class="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center">
            <Settings class="h-6 w-6 text-gray-600" />
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-medium text-gray-900">Relatórios Personalizados</h3>
            <p class="text-sm text-gray-500">Crie seus próprios relatórios</p>
          </div>
        </div>
        <p class="text-gray-600 text-sm">
          Ferramenta para criar relatórios personalizados com filtros e métricas específicas.
        </p>
        <div class="mt-4 flex items-center text-gray-400 text-sm font-medium">
          <span>Em breve</span>
        </div>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="bg-white rounded-lg border border-gray-200 p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Estatísticas Rápidas</h3>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="text-center">
          <div class="text-2xl font-bold text-blue-600">{{ reportsStore.totalTasks || '-' }}</div>
          <div class="text-sm text-gray-500">Total de Tarefas</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-green-600">{{ reportsStore.overview?.completedTasks || '-' }}</div>
          <div class="text-sm text-gray-500">Concluídas</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-amber-600">{{ reportsStore.overview?.inProgressTasks || '-' }}</div>
          <div class="text-sm text-gray-500">Em Andamento</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-purple-600">{{ reportsStore.userPerformance?.length || '-' }}</div>
          <div class="text-sm text-gray-500">Usuários Ativos</div>
        </div>
      </div>
      <div class="mt-4 text-center">
        <button
          @click="$router.push('/reports-dashboard')"
          class="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          <BarChart3 class="h-4 w-4 mr-2" />
          Ver Dashboard Completo
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useReportsStore } from '../stores/reports.js'
import { 
  BarChart3, 
  FileText, 
  Users, 
  Clock, 
  FolderOpen, 
  Settings, 
  ArrowRight 
} from 'lucide-vue-next'

const reportsStore = useReportsStore()

// Load basic overview data when component mounts
onMounted(async () => {
  try {
    await reportsStore.fetchDashboard()
  } catch (error) {
    console.error('Erro ao carregar dados dos relatórios:', error)
  }
})
</script>
