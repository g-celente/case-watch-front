<template>
    <div class="min-h-screen bg-white">
        <!-- Sidebar -->
        <Sidebar :is-open="sidebarOpen" :is-mobile="isMobile" @toggle="toggleSidebar" />

        <!-- Main Content -->
        <div class="transition-all duration-300" :class="{ 'lg:ml-64': sidebarOpen, 'lg:ml-0': !sidebarOpen }">
            <!-- Header -->
            <header class="bg-white shadow-sm border-b border-gray-200">
                <div class="px-4 sm:px-6 lg:px-8">
                    <div class="flex justify-between items-center h-16">
                        <!-- Mobile menu button -->
                        <button @click="toggleSidebar"
                            class="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary">
                            <Menu class="w-6 h-6" />
                        </button>

                        <!-- Page title -->
                        <div class="flex-1 min-w-0 px-4 lg:px-0">
                            <h1 class="text-2xl font-semibold text-gray-900 truncate">
                                {{ pageTitle }}
                            </h1>
                        </div>

                        <!-- Header actions -->
                        <div class="flex items-center space-x-4">
                            <!-- User menu -->
                            <div class="relative">
                                <button @click="showUserMenu = !showUserMenu"
                                    class="flex items-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary">
                                    <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                        <User class="w-4 h-4 text-gray-600" />
                                    </div>
                                </button>

                                <!-- Dropdown menu -->
                                <div v-if="showUserMenu"
                                    class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                                    @click.away="showUserMenu = false">
                                    <button @click="handleProfile"
                                        class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        <User class="w-4 h-4 mr-3" />
                                        Perfil
                                    </button>
                                    <button @click="handleLogout"
                                        class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        <LogOut class="w-4 h-4 mr-3" />
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Page Content -->
            <main class="p-4 sm:p-6 lg:p-8 bg-white">
                <div class="p-6">
                    <div class="w-full">
                        <router-view v-slot="{ Component }">
                            <transition enter-active-class="transition-opacity duration-200 ease-out"
                                enter-from-class="opacity-0" enter-to-class="opacity-100"
                                leave-active-class="transition-opacity duration-150 ease-in"
                                leave-from-class="opacity-100" leave-to-class="opacity-0">
                                <component :is="Component" />
                            </transition>
                        </router-view>
                    </div>
                </div>
            </main>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth/auth.js'
import { useDark, useToggle } from '@vueuse/core'
import { Menu, User, LogOut } from 'lucide-vue-next'
import Sidebar from './Sidebar.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// Sidebar state
const sidebarOpen = ref(true)
const isMobile = ref(false)
const showUserMenu = ref(false)

// Page title based on current route
const pageTitle = computed(() => {
    const routeNames = {
        'Dashboard': 'Dashboard',
        'Tasks': 'Tarefas',
        'Categories': 'Categorias',
        'Users': 'Usuários',
        'Reports': 'Relatórios'
    }
    return routeNames[route.name] || 'TaskManager'
})

const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value
}

const handleProfile = () => {
    showUserMenu.value = false
    // router.push('/profile')
}

const handleLogout = async () => {
    showUserMenu.value = false
    try {
        await authStore.logout()
        router.push('/login')
    } catch (error) {
        console.error('Erro ao fazer logout:', error)
        router.push('/login')
    }
}

// Check screen size
const checkScreenSize = () => {
    isMobile.value = window.innerWidth < 1024
    if (isMobile.value) {
        sidebarOpen.value = false
    } else {
        sidebarOpen.value = true
    }
}

// Close user menu when clicking outside
const handleClickOutside = (event) => {
    if (showUserMenu.value && !event.target.closest('.relative')) {
        showUserMenu.value = false
    }
}

onMounted(() => {
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    window.removeEventListener('resize', checkScreenSize)
    document.removeEventListener('click', handleClickOutside)
})
</script>
