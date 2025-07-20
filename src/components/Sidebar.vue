<template>
  <aside class="fixed left-0 top-0 z-40 h-screen w-64 bg-white border-r border-gray-200" :class="{ '-translate-x-full': !isOpen, 'translate-x-0': isOpen }">
    <div class="h-full px-3 py-4 overflow-y-auto">
      <!-- Logo -->
      <div class="flex items-center mb-8 px-3">
        <div class="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
          <CheckSquare class="w-5 h-5 text-white" />
        </div>
        <span class="text-xl font-semibold text-gray-900">TaskManager</span>
      </div>

      <!-- Navigation -->
      <nav class="space-y-2">
        <router-link
          v-for="item in navigationItems"
          :key="item.name"
          :to="item.path"
          class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors"
          :class="[
            $route.path === item.path
              ? 'bg-purple-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          ]"
        >
          <component :is="item.icon" class="w-5 h-5 mr-3" />
          {{ item.name }}
        </router-link>
      </nav>

      <!-- User Section -->
      <div class="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-200">
        <div class="flex items-center px-3 py-2">
          <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
            <User class="w-4 h-4 text-gray-600" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 truncate">
              {{ user?.name || 'Usuário' }}
            </p>
            <p class="text-xs text-gray-500 truncate">
              {{ user?.email }}
            </p>
          </div>
          <button
            @click="handleLogout"
            class="p-1 text-gray-400 hover:text-gray-600"
            title="Logout"
          >
            <LogOut class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </aside>

  <!-- Overlay for mobile -->
  <div
    v-if="isOpen && isMobile"
    class="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
    @click="$emit('toggle')"
  ></div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth/auth.js'
import { CheckSquare, LayoutDashboard, CheckCircle, FolderOpen, Users, BarChart3, User, LogOut, UserCheck } from 'lucide-vue-next'

defineProps({
  isOpen: {
    type: Boolean,
    default: true
  },
  isMobile: {
    type: Boolean,
    default: false
  }
})

defineEmits(['toggle'])

const router = useRouter()
const authStore = useAuthStore()

const user = computed(() => authStore.user)

const navigationItems = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard
  },
  {
    name: 'Minhas Tarefas',
    path: '/my-tasks',
    icon: UserCheck
  },
  {
    name: 'Categorias',
    path: '/categories',
    icon: FolderOpen
  },
  {
    name: 'Relatórios',
    path: '/reports',
    icon: BarChart3
  }
]

const handleLogout = async () => {
  try {
    await authStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('Erro ao fazer logout:', error)
    router.push('/login')
  }
}
</script>
