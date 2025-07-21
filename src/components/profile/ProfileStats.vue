<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6 transition-all duration-300 hover:shadow-md">
    <h2 class="text-lg font-medium text-gray-900 mb-5 flex items-center">
      <BarChart2 class="w-5 h-5 mr-2 text-purple-500" />
      Estatísticas
    </h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
      <!-- Tarefas criadas -->
      <div class="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow transition-all duration-300 hover:border-blue-200">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
              <ClipboardList class="w-6 h-6 text-blue-500" />
            </div>
          </div>
          <div class="ml-4">
            <h3 class="text-sm font-medium text-gray-500">Tarefas Criadas</h3>
            <p class="text-2xl font-semibold text-gray-900">
              <span v-if="isLoading" class="inline-block w-8 h-7 bg-gray-200 rounded animate-pulse"></span>
              <span v-else>{{ stats?.tasksCreated || 0 }}</span>
            </p>
          </div>
        </div>
      </div>
      
      <!-- Tarefas atribuídas -->
      <div class="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow transition-all duration-300 hover:border-purple-200">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center">
              <UserCheck class="w-6 h-6 text-purple-500" />
            </div>
          </div>
          <div class="ml-4">
            <h3 class="text-sm font-medium text-gray-500">Tarefas Atribuídas</h3>
            <p class="text-2xl font-semibold text-gray-900">
              <span v-if="isLoading" class="inline-block w-8 h-7 bg-gray-200 rounded animate-pulse"></span>
              <span v-else>{{ stats?.tasksAssigned || 0 }}</span>
            </p>
          </div>
        </div>
      </div>
      
      <!-- Taxa de conclusão -->
      <div class="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow transition-all duration-300 hover:border-green-200">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
              <CheckCircle class="w-6 h-6 text-green-500" />
            </div>
          </div>
          <div class="ml-4">
            <h3 class="text-sm font-medium text-gray-500">Taxa de Conclusão</h3>
            <p class="text-2xl font-semibold text-gray-900">
              <span v-if="isLoading" class="inline-block w-16 h-7 bg-gray-200 rounded animate-pulse"></span>
              <span v-else>{{ (stats?.completionRate || 0) + '%' }}</span>
            </p>
          </div>
        </div>
      </div>
      
      <!-- Colaborações -->
      <div class="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow transition-all duration-300 hover:border-amber-200">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center">
              <Users class="w-6 h-6 text-amber-500" />
            </div>
          </div>
          <div class="ml-4">
            <h3 class="text-sm font-medium text-gray-500">Colaborações</h3>
            <p class="text-2xl font-semibold text-gray-900">
              <span v-if="isLoading" class="inline-block w-8 h-7 bg-gray-200 rounded animate-pulse"></span>
              <span v-else>{{ stats?.activeCollaborations || 0 }}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ClipboardList, UserCheck, CheckCircle, Users, BarChart2 } from 'lucide-vue-next'

const props = defineProps({
  stats: {
    type: Object,
    default: () => ({})
  },
  isLoading: {
    type: Boolean,
    default: false
  }
})
</script>
