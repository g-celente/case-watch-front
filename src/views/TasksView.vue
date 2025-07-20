<template>
    <div class="space-y-6">
        <!-- Header -->
        <div class="flex justify-between items-center">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">Tarefas</h1>
                <p class="text-gray-600">Gerencie todas as suas tarefas</p>
            </div>
            <Button @click="openCreateDialog" class="bg-purple-600 hover:bg-purple-700">
                <Plus class="w-4 h-4 mr-2" />
                Nova Tarefa
            </Button>
        </div>

        <!-- Filters -->
        <Card>
            <CardContent class="p-6">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    <BaseFormField v-model="filters.search" placeholder="Buscar tarefas..."
                        @update:modelValue="handleFilterChange">
                        <template #default="{ fieldId }">
                            <div class="relative">
                                <Search
                                    class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <input :id="fieldId" v-model="filters.search" type="text"
                                    placeholder="Buscar tarefas..."
                                    class="block w-full pl-10 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                                    @input="handleFilterChange" />
                            </div>
                        </template>
                    </BaseFormField>

                    <select v-model="filters.status" @change="handleFilterChange"
                        class="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500">
                        <option value="">Todos os status</option>
                        <option value="pending">Pendente</option>
                        <option value="in_progress">Em Andamento</option>
                        <option value="completed">Concluída</option>
                        <option value="cancelled">Cancelada</option>
                    </select>

                    <select v-model="filters.priority" @change="handleFilterChange"
                        class="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500">
                        <option value="">Todas as prioridades</option>
                        <option value="low">Baixa</option>
                        <option value="medium">Média</option>
                        <option value="high">Alta</option>
                        <option value="urgent">Urgente</option>
                    </select>

                    <select v-model="filters.categoryId" @change="handleFilterChange"
                        class="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500">
                        <option value="">Todas as categorias</option>
                        <option v-for="category in categoriesStore.categoriesOptions" :key="category.value"
                            :value="category.value">
                            {{ category.label }}
                        </option>
                    </select>

                    <label class="flex items-center">
                        <input v-model="filters.overdue" type="checkbox" @change="handleFilterChange"
                            class="rounded border-gray-300 text-purple-600 shadow-sm focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50" />
                        <span class="ml-2 text-sm text-gray-700">Apenas em atraso</span>
                    </label>

                    <Button variant="outline" @click="resetFilters" class="w-full">
                        <RotateCcw class="w-4 h-4 mr-2" />
                        Limpar
                    </Button>
                </div>
            </CardContent>
        </Card>

        <!-- Stats -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
                <CardContent class="p-6">
                    <div class="flex items-center">
                        <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <CheckCircle class="w-5 h-5 text-blue-600" />
                        </div>
                        <div class="ml-4">
                            <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">
                                Total
                            </p>
                            <p class="text-2xl font-semibold text-gray-900">
                                {{ tasksStore.taskStats.total }}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent class="p-6">
                    <div class="flex items-center">
                        <div class="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <Clock class="w-5 h-5 text-yellow-600" />
                        </div>
                        <div class="ml-4">
                            <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">
                                Pendentes
                            </p>
                            <p class="text-2xl font-semibold text-gray-900">
                                {{ tasksStore.taskStats.pending }}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent class="p-6">
                    <div class="flex items-center">
                        <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Play class="w-5 h-5 text-purple-600" />
                        </div>
                        <div class="ml-4">
                            <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">
                                Em Andamento
                            </p>
                            <p class="text-2xl font-semibold text-gray-900">
                                {{ tasksStore.taskStats.inProgress }}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent class="p-6">
                    <div class="flex items-center">
                        <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <Check class="w-5 h-5 text-green-600" />
                        </div>
                        <div class="ml-4">
                            <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">
                                Concluídas
                            </p>
                            <p class="text-2xl font-semibold text-gray-900">
                                {{ tasksStore.taskStats.completed }}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>

        <!-- Tasks List -->
        <Card>
            <CardHeader>
                <div class="flex justify-between items-center">
                    <div>
                        <CardTitle>Lista de Tarefas</CardTitle>
                        <CardDescription>
                            {{ tasksStore.tasks.length }} tarefa(s) encontrada(s)
                        </CardDescription>
                    </div>
                    <div class="flex items-center space-x-2">
                        <select v-model="filters.sortBy" @change="handleFilterChange"
                            class="text-sm rounded-md border border-gray-300 px-3 py-1 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500">
                            <option value="createdAt">Data de Criação</option>
                            <option value="dueDate">Data de Vencimento</option>
                            <option value="title">Título</option>
                            <option value="priority">Prioridade</option>
                        </select>
                        <Button variant="outline" size="sm" @click="toggleSortOrder">
                            <component :is="filters.sortOrder === 'asc' ? ArrowUp : ArrowDown" class="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent class="p-0">
                <!-- Loading State -->
                <div v-if="tasksStore.loading" class="p-8 text-center">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                    <p class="text-gray-500 mt-2">Carregando tarefas...</p>
                </div>

                <!-- Empty State -->
                <div v-else-if="tasksStore.tasks.length === 0" class="p-8 text-center">
                    <ClipboardList class="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 class="text-lg font-medium text-gray-900 mb-2">Nenhuma tarefa encontrada</h3>
                    <p class="text-gray-500 mb-6">
                        {{ hasActiveFilters ? 'Tente ajustar os filtros ou' : 'Comece' }} criando sua primeira tarefa.
                    </p>
                    <Button @click="openCreateDialog" class="bg-purple-600 hover:bg-purple-700">
                        <Plus class="w-4 h-4 mr-2" />
                        Nova Tarefa
                    </Button>
                </div>

                <!-- Tasks Table -->
                <div v-else class="overflow-hidden">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tarefa
                                </th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Prioridade
                                </th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Categoria
                                </th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Vencimento
                                </th>
                                <th
                                    class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr v-for="task in tasksStore.tasks" :key="task.id"
                                class="hover:bg-gray-50 transition-colors">
                                <td class="px-6 py-4">
                                    <div class="flex items-center">
                                        <div class="w-3 h-3 rounded-full mr-3" :class="getStatusColor(task.status)">
                                        </div>
                                        <div>
                                            <div class="text-sm font-medium text-gray-900">
                                                {{ task.title }}
                                            </div>
                                            <div class="text-sm text-gray-500">
                                                {{ task.description }}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <select :value="task.status"
                                        @change="updateTaskStatus(task.id, $event.target.value)"
                                        class="text-xs rounded-full px-2 py-1 font-semibold border-0 focus:ring-2 focus:ring-purple-500"
                                        :class="getStatusBadgeClass(task.status)">
                                        <option value="PENDING">Pendente</option>
                                        <option value="IN_PROGRESS">Em Andamento</option>
                                        <option value="COMPLETED">Concluída</option>
                                        <option value="CANCELLED">Cancelada</option>
                                    </select>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <select :value="task.priority"
                                        @change="updateTaskPriority(task.id, $event.target.value)"
                                        class="text-xs rounded-full px-2 py-1 font-semibold border-0 focus:ring-2 focus:ring-purple-500"
                                        :class="getPriorityBadgeClass(task.priority)">
                                        <option value="LOW">Baixa</option>
                                        <option value="MEDIUM">Média</option>
                                        <option value="HIGH">Alta</option>
                                        <option value="URGENT">Urgente</option>
                                    </select>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span v-if="task.category"
                                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                                        :style="{ backgroundColor: task.category.color + '20', color: task.category.color }">
                                        {{ task.category.name }}
                                    </span>
                                    <span v-else class="text-gray-400 text-sm">Sem categoria</span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {{ formatDate(task.dueDate) }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div class="flex justify-end space-x-2">
                                        <Button variant="ghost" size="sm" @click="editTask(task)">
                                            <Edit2 class="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm" @click="confirmDeleteTask(task)"
                                            class="text-red-600 hover:text-red-700">
                                            <Trash2 class="w-4 h-4" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>

        <!-- Pagination -->
        <div v-if="tasksStore.pagination.totalPages > 1" class="flex items-center justify-between">
            <div class="text-sm text-gray-700">
                Mostrando {{ (tasksStore.pagination.page - 1) * tasksStore.pagination.limit + 1 }} a
                {{ Math.min(tasksStore.pagination.page * tasksStore.pagination.limit, tasksStore.pagination.total) }}
                de {{ tasksStore.pagination.total }} resultados
            </div>
            <div class="flex space-x-2">
                <Button variant="outline" size="sm" :disabled="tasksStore.pagination.page === 1"
                    @click="changePage(tasksStore.pagination.page - 1)">
                    <ChevronLeft class="w-4 h-4" />
                    Anterior
                </Button>
                <Button variant="outline" size="sm"
                    :disabled="tasksStore.pagination.page === tasksStore.pagination.totalPages"
                    @click="changePage(tasksStore.pagination.page + 1)">
                    Próxima
                    <ChevronRight class="w-4 h-4" />
                </Button>
            </div>
        </div>
    </div>

    <!-- Task Form Dialog -->
    <TaskFormDialog :is-open="showTaskDialog" :task="selectedTask" @close="closeTaskDialog" @saved="handleTaskSaved" />

    <!-- Confirm Delete Dialog -->
    <ConfirmDialog :is-open="showDeleteDialog" type="danger" title="Excluir Tarefa"
        :message="`Tem certeza que deseja excluir a tarefa '${taskToDelete?.title}'? Esta ação não pode ser desfeita.`"
        confirm-text="Excluir" :loading="deleteLoading" @confirm="handleDeleteTask" @cancel="closeDeleteDialog" />
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useTasksStore } from '../stores/tasks.js'
import { useCategoriesStore } from '../stores/categories.js'
import { useToast } from '../composables/useToast.js'
import {
    Plus,
    Search,
    CheckCircle,
    Clock,
    Check,
    Play,
    Edit2,
    Trash2,
    ClipboardList,
    RotateCcw,
    ArrowUp,
    ArrowDown,
    ChevronLeft,
    ChevronRight
} from 'lucide-vue-next'

// Components
import Card from '../components/ui/Card.vue'
import CardHeader from '../components/ui/CardHeader.vue'
import CardTitle from '../components/ui/CardTitle.vue'
import CardDescription from '../components/ui/CardDescription.vue'
import CardContent from '../components/ui/CardContent.vue'
import Button from '../components/ui/Button.vue'
import BaseFormField from '../components/ui/BaseFormField.vue'
import ConfirmDialog from '../components/ui/ConfirmDialog.vue'
import TaskFormDialog from '../components/TaskFormDialog.vue'

const tasksStore = useTasksStore()
const categoriesStore = useCategoriesStore()
const toast = useToast()

// Dialog states
const showTaskDialog = ref(false)
const showDeleteDialog = ref(false)
const selectedTask = ref(null)
const taskToDelete = ref(null)
const deleteLoading = ref(false)

// Filters
const filters = ref({
    search: '',
    status: '',
    priority: '',
    categoryId: '',
    overdue: false,
    sortBy: 'createdAt',
    sortOrder: 'desc'
})

const hasActiveFilters = computed(() => {
    return filters.value.search ||
        filters.value.status ||
        filters.value.priority ||
        filters.value.categoryId ||
        filters.value.overdue
})

// Debounced filter change
let filterTimeout = null
const handleFilterChange = () => {
    clearTimeout(filterTimeout)
    filterTimeout = setTimeout(() => {
        tasksStore.setFilters(filters.value)
        tasksStore.fetchTasks()
    }, 300)
}

const resetFilters = () => {
    filters.value = {
        search: '',
        status: '',
        priority: '',
        categoryId: '',
        overdue: false,
        sortBy: 'createdAt',
        sortOrder: 'desc'
    }
    tasksStore.resetFilters()
    tasksStore.fetchTasks()
}

const toggleSortOrder = () => {
    filters.value.sortOrder = filters.value.sortOrder === 'asc' ? 'desc' : 'asc'
    handleFilterChange()
}

const changePage = (page) => {
    tasksStore.setPage(page)
    tasksStore.fetchTasks()
}

// Task operations
const openCreateDialog = () => {
    selectedTask.value = null
    showTaskDialog.value = true
}

const editTask = (task) => {
    selectedTask.value = task
    showTaskDialog.value = true
}

const closeTaskDialog = () => {
    showTaskDialog.value = false
    selectedTask.value = null
}

const handleTaskSaved = () => {
    closeTaskDialog()
    tasksStore.fetchTasks()
    toast.success(selectedTask.value ? 'Tarefa atualizada com sucesso!' : 'Tarefa criada com sucesso!')
}

const confirmDeleteTask = (task) => {
    taskToDelete.value = task
    showDeleteDialog.value = true
}

const closeDeleteDialog = () => {
    showDeleteDialog.value = false
    taskToDelete.value = null
    deleteLoading.value = false
}

const handleDeleteTask = async () => {
    try {
        deleteLoading.value = true
        await tasksStore.deleteTask(taskToDelete.value.id)
        toast.success('Tarefa excluída com sucesso!')
        closeDeleteDialog()
    } catch (error) {
        toast.error('Erro ao excluir tarefa')
        deleteLoading.value = false
    }
}

const updateTaskStatus = async (taskId, status) => {
    try {
        await tasksStore.updateTaskStatus(taskId, status)
        toast.success('Status atualizado com sucesso!')
    } catch (error) {
        toast.error('Erro ao atualizar status')
    }
}

const updateTaskPriority = async (taskId, priority) => {
    try {
        await tasksStore.updateTaskPriority(taskId, priority)
        toast.success('Prioridade atualizada com sucesso!')
    } catch (error) {
        toast.error('Erro ao atualizar prioridade')
    }
}

// Helper functions
const formatDate = (date) => {
    if (!date) return 'Sem data'
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(new Date(date))
}

const getStatusColor = (status) => {
    const colors = {
        pending: 'bg-gray-400',
        in_progress: 'bg-yellow-500',
        completed: 'bg-green-500',
        cancelled: 'bg-red-500'
    }
    return colors[status] || 'bg-gray-400'
}

const getStatusBadgeClass = (status) => {
    const classes = {
        pending: 'bg-gray-100 text-gray-800',
        in_progress: 'bg-yellow-100 text-yellow-800',
        completed: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800'
    }
    return classes[status] || 'bg-gray-100 text-gray-800'
}

const getPriorityBadgeClass = (priority) => {
    const classes = {
        low: 'bg-blue-100 text-blue-800',
        medium: 'bg-yellow-100 text-yellow-800',
        high: 'bg-orange-100 text-orange-800',
        urgent: 'bg-red-100 text-red-800'
    }
    return classes[priority] || 'bg-gray-100 text-gray-800'
}

// Initialize
onMounted(async () => {
    await Promise.all([
        categoriesStore.fetchCategories(),
        tasksStore.fetchTasks()
    ])
})
</script>
