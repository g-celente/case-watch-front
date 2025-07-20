<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-medium text-gray-900">Exportar Relatório</h3>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600"
        >
          <X class="h-5 w-5" />
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Export Type -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Relatório
          </label>
          <select
            v-model="form.type"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="dashboard">Dashboard Completo</option>
            <option value="tasks-by-status">Tarefas por Status</option>
            <option value="tasks-by-category">Tarefas por Categoria</option>
            <option value="productivity">Produtividade</option>
            <option value="user-performance">Performance dos Usuários</option>
            <option value="custom">Relatório Personalizado</option>
          </select>
        </div>

        <!-- Date Range (for custom reports) -->
        <div v-if="form.type === 'custom'" class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Data Inicial
            </label>
            <input
              v-model="form.startDate"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Data Final
            </label>
            <input
              v-model="form.endDate"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
        </div>

        <!-- Format -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Formato
          </label>
          <select
            v-model="form.format"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="pdf">PDF</option>
            <option value="excel">Excel (.xlsx)</option>
            <option value="csv">CSV</option>
            <option value="png">Imagem (PNG)</option>
          </select>
        </div>

        <!-- Include Options -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Incluir
          </label>
          <div class="space-y-2">
            <label class="flex items-center">
              <input
                v-model="form.includeCharts"
                type="checkbox"
                class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <span class="ml-2 text-sm text-gray-700">Gráficos</span>
            </label>
            <label class="flex items-center">
              <input
                v-model="form.includeData"
                type="checkbox"
                class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <span class="ml-2 text-sm text-gray-700">Dados Detalhados</span>
            </label>
            <label class="flex items-center">
              <input
                v-model="form.includeSummary"
                type="checkbox"
                class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <span class="ml-2 text-sm text-gray-700">Resumo Executivo</span>
            </label>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end space-x-3 pt-4">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div v-if="loading" class="flex items-center">
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Exportando...
            </div>
            <div v-else class="flex items-center">
              <Download class="h-4 w-4 mr-2" />
              Exportar
            </div>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { X, Download } from 'lucide-vue-next'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close', 'export'])

const loading = ref(false)

const form = reactive({
  type: 'dashboard',
  format: 'pdf',
  startDate: '',
  endDate: '',
  includeCharts: true,
  includeData: true,
  includeSummary: true
})

const handleSubmit = async () => {
  loading.value = true
  
  try {
    // Validate custom date range
    if (form.type === 'custom') {
      if (!form.startDate || !form.endDate) {
        throw new Error('Data inicial e final são obrigatórias para relatórios personalizados')
      }
      
      if (new Date(form.startDate) > new Date(form.endDate)) {
        throw new Error('Data inicial deve ser anterior à data final')
      }
    }

    // Emit export event with form data
    await emit('export', { ...form })
    
    // Close modal on success
    emit('close')
  } catch (error) {
    console.error('Erro ao exportar:', error)
    // You could show a toast notification here
  } finally {
    loading.value = false
  }
}
</script>
