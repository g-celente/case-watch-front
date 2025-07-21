<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6 transition-all duration-300 hover:shadow-md">
    <h2 class="text-lg font-medium text-gray-900 mb-5 flex items-center">
      <Activity class="w-5 h-5 mr-2 text-purple-500" />
      Atividades Recentes
    </h2>
    
    <div class="space-y-6">
      <!-- Timeline -->
      <div class="flow-root">
        <ul class="-mb-8">
          <li v-for="(activity, index) in activities" :key="activity.id">
            <div class="relative pb-8">
              <!-- Linha conectora, exceto para o último item -->
              <span 
                v-if="index !== activities.length - 1" 
                class="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200" 
                aria-hidden="true"
              ></span>
              
              <div class="relative flex items-start space-x-4">
                <!-- Ícone -->
                <div class="relative flex-shrink-0">
                  <div 
                    class="h-10 w-10 rounded-full flex items-center justify-center ring-4 ring-white shadow-sm"
                    :class="getActivityIconBgClass(activity.type)"
                  >
                    <component 
                      :is="getActivityIcon(activity.type)" 
                      class="h-5 w-5 text-white"
                    />
                  </div>
                </div>
                
                <!-- Conteúdo -->
                <div class="flex-1 min-w-0 p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div>
                    <div class="text-sm">
                      <span class="font-medium text-gray-900">{{ activity.title }}</span>
                    </div>
                    <p class="mt-1 text-sm text-gray-600">
                      {{ activity.description }}
                    </p>
                  </div>
                  <div class="mt-2 text-xs text-gray-500 flex items-center">
                    <Clock class="w-3 h-3 mr-1 inline" />
                    <time :datetime="activity.createdAt">{{ formatRelativeTime(activity.createdAt) }}</time>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
      
      <!-- Estado de carregamento -->
      <div v-if="isLoading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-t-2 border-purple-600"></div>
      </div>
      
      <!-- Estado vazio -->
      <div v-if="!isLoading && (!activities || activities.length === 0)" class="text-center py-10">
        <div class="bg-gray-50 rounded-xl p-8 border border-gray-100">
          <Activity class="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p class="text-gray-500 font-medium">Nenhuma atividade recente encontrada</p>
          <p class="text-gray-400 text-sm mt-2">Suas atividades aparecerão aqui conforme você interage com o sistema</p>
        </div>
      </div>
      
      <!-- Ver mais link -->
      <div v-if="!isLoading && activities.length > 0" class="mt-6 text-center">
        <button 
          @click="$emit('load-more')" 
          class="inline-flex items-center px-4 py-2 border border-purple-200 rounded-lg text-sm font-medium text-purple-700 bg-white hover:bg-purple-50 transition-colors duration-200"
        >
          <ChevronDown class="w-4 h-4 mr-2" />
          Ver mais atividades
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { 
  Activity, 
  CheckCircle, 
  PenSquare, 
  Trash, 
  Plus, 
  Clock, 
  MessageCircle, 
  Share2,
  UserCheck,
  ChevronDown
} from 'lucide-vue-next'

const props = defineProps({
  activities: {
    type: Array,
    default: () => []
  },
  isLoading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['load-more'])

const getActivityIcon = (type) => {
  const icons = {
    'TASK_CREATED': Plus,
    'TASK_UPDATED': PenSquare,
    'TASK_COMPLETED': CheckCircle,
    'TASK_DELETED': Trash,
    'TASK_COMMENT': MessageCircle,
    'TASK_ASSIGNED': UserCheck,
    'TASK_SHARED': Share2,
    'DUE_DATE': Clock,
    'default': Activity
  }
  
  return icons[type] || icons.default
}

const getActivityIconBgClass = (type) => {
  const colors = {
    'TASK_CREATED': 'bg-blue-500',
    'TASK_UPDATED': 'bg-amber-500',
    'TASK_COMPLETED': 'bg-green-500',
    'TASK_DELETED': 'bg-red-500',
    'TASK_COMMENT': 'bg-indigo-500',
    'TASK_ASSIGNED': 'bg-purple-500',
    'TASK_SHARED': 'bg-cyan-500',
    'DUE_DATE': 'bg-orange-500',
    'default': 'bg-gray-500'
  }
  
  return colors[type] || colors.default
}

const formatRelativeTime = (dateString) => {
  if (!dateString) return 'N/A'
  
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  
  if (diffMins < 1) return 'Agora mesmo'
  if (diffMins < 60) return `${diffMins} min atrás`
  if (diffHours < 24) return `${diffHours} h atrás`
  if (diffDays < 7) return `${diffDays} dia${diffDays > 1 ? 's' : ''} atrás`
  
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date)
}
</script>
