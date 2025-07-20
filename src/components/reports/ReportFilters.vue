<template>
  <div class="bg-white rounded-lg border border-gray-200 p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-medium text-gray-900">Filtros</h3>
      <button
        @click="resetFilters"
        class="text-sm text-purple-600 hover:text-purple-700 font-medium"
      >
        Limpar Filtros
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      <!-- Data Range -->
      <div class="col-span-2">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Período
        </label>
        <div class="grid grid-cols-2 gap-2">
          <input
            v-model="localFilters.dateRange.start"
            type="date"
            class="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-purple-500 focus:border-purple-500"
            placeholder="Data inicial"
          />
          <input
            v-model="localFilters.dateRange.end"
            type="date"
            class="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-purple-500 focus:border-purple-500"
            placeholder="Data final"
          />
        </div>
      </div>

      <!-- Status -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Status
        </label>
        <select
          v-model="localFilters.status"
          class="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-purple-500 focus:border-purple-500"
        >
          <option value="">Todos</option>
          <option value="PENDING">Pendente</option>
          <option value="IN_PROGRESS">Em Progresso</option>
          <option value="COMPLETED">Concluída</option>
          <option value="CANCELLED">Cancelada</option>
        </select>
      </div>

      <!-- Priority -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Prioridade
        </label>
        <select
          v-model="localFilters.priority"
          class="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-purple-500 focus:border-purple-500"
        >
          <option value="">Todas</option>
          <option value="LOW">Baixa</option>
          <option value="MEDIUM">Média</option>
          <option value="HIGH">Alta</option>
          <option value="URGENT">Urgente</option>
        </select>
      </div>

      <!-- Category -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Categoria
        </label>
        <select
          v-model="localFilters.category"
          class="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-purple-500 focus:border-purple-500"
        >
          <option value="">Todas</option>
          <option
            v-for="category in categories"
            :key="category.id"
            :value="category.id"
          >
            {{ category.name }}
          </option>
        </select>
      </div>

      <!-- User -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Usuário
        </label>
        <select
          v-model="localFilters.user"
          class="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-purple-500 focus:border-purple-500"
        >
          <option value="">Todos</option>
          <option
            v-for="user in users"
            :key="user.id"
            :value="user.id"
          >
            {{ user.name }}
          </option>
        </select>
      </div>
    </div>

    <!-- Quick Filters -->
    <div class="mt-4 pt-4 border-t border-gray-200">
      <div class="flex items-center space-x-3">
        <span class="text-sm font-medium text-gray-700">Períodos rápidos:</span>
        <button
          v-for="quickFilter in quickFilters"
          :key="quickFilter.key"
          @click="applyQuickFilter(quickFilter)"
          class="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
        >
          {{ quickFilter.label }}
        </button>
      </div>
    </div>

    <!-- Apply Button -->
    <div class="mt-4 flex justify-end">
      <button
        @click="applyFilters"
        :disabled="loading"
        class="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
      >
        <Filter class="h-4 w-4 mr-2" />
        {{ loading ? 'Aplicando...' : 'Aplicar Filtros' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Filter } from 'lucide-vue-next'

const props = defineProps({
  filters: {
    type: Object,
    required: true
  },
  categories: {
    type: Array,
    default: () => []
  },
  users: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:filters', 'apply'])

const localFilters = reactive({ ...props.filters })

const quickFilters = [
  {
    key: 'today',
    label: 'Hoje',
    start: new Date().toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  },
  {
    key: 'week',
    label: 'Esta Semana',
    start: getStartOfWeek().toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  },
  {
    key: 'month',
    label: 'Este Mês',
    start: getStartOfMonth().toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  },
  {
    key: 'quarter',
    label: 'Trimestre',
    start: getStartOfQuarter().toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  }
]

function getStartOfWeek() {
  const date = new Date()
  const day = date.getDay()
  const diff = date.getDate() - day + (day === 0 ? -6 : 1)
  return new Date(date.setDate(diff))
}

function getStartOfMonth() {
  const date = new Date()
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function getStartOfQuarter() {
  const date = new Date()
  const quarter = Math.floor(date.getMonth() / 3)
  return new Date(date.getFullYear(), quarter * 3, 1)
}

const applyQuickFilter = (quickFilter) => {
  localFilters.dateRange.start = quickFilter.start
  localFilters.dateRange.end = quickFilter.end
  applyFilters()
}

const applyFilters = () => {
  emit('update:filters', { ...localFilters })
  emit('apply', { ...localFilters })
}

const resetFilters = () => {
  Object.assign(localFilters, {
    dateRange: {
      start: null,
      end: null
    },
    category: '',
    user: '',
    status: '',
    priority: ''
  })
  applyFilters()
}

onMounted(() => {
  // Set default to current month
  if (!localFilters.dateRange.start && !localFilters.dateRange.end) {
    localFilters.dateRange.start = getStartOfMonth().toISOString().split('T')[0]
    localFilters.dateRange.end = new Date().toISOString().split('T')[0]
  }
})
</script>
