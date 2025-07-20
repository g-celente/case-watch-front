<template>
  <TheContainer>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Categorias</h1>
          <p class="text-gray-600">Organize suas tarefas por categorias</p>
        </div>
        <Button @click="openCreateDialog" class="bg-purple-600 hover:bg-purple-700">
          <Plus class="w-4 h-4 mr-2" />
          Nova Categoria
        </Button>
      </div>

      <!-- Search and Filters -->
      <Card>
        <CardContent class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <BaseFormField
              v-model="filters.search"
              placeholder="Buscar categorias..."
              @update:modelValue="handleFilterChange"
            >
              <template #default="{ fieldId }">
                <div class="relative">
                  <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    :id="fieldId"
                    v-model="filters.search"
                    type="text"
                    placeholder="Buscar categorias..."
                    class="block w-full pl-10 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    @input="handleFilterChange"
                  />
                </div>
              </template>
            </BaseFormField>

            <select
              v-model="filters.sortBy"
              @change="handleFilterChange"
              class="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            >
              <option value="name">Ordenar por Nome</option>
              <option value="createdAt">Data de Criação</option>
              <option value="tasksCount">Número de Tarefas</option>
            </select>

            <div class="flex space-x-2">
              <Button
                variant="outline"
                @click="toggleSortOrder"
                class="flex-1"
              >
                <component
                  :is="filters.sortOrder === 'asc' ? ArrowUp : ArrowDown"
                  class="w-4 h-4 mr-2"
                />
                {{ filters.sortOrder === 'asc' ? 'Crescente' : 'Decrescente' }}
              </Button>
              <Button variant="outline" @click="resetFilters">
                <RotateCcw class="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Categories Grid -->
      <div v-if="categoriesStore.loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
        <p class="text-gray-500 mt-2">Carregando categorias...</p>
      </div>

      <div v-else-if="categoriesStore.categories.length === 0" class="text-center py-12">
        <FolderPlus class="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">Nenhuma categoria encontrada</h3>
        <p class="text-gray-500 mb-6">
          {{ hasActiveFilters ? 'Tente ajustar os filtros ou' : 'Comece' }} criando sua primeira categoria.
        </p>
        <Button @click="openCreateDialog" class="bg-purple-600 hover:bg-purple-700">
          <Plus class="w-4 h-4 mr-2" />
          Nova Categoria
        </Button>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <Card
          v-for="category in categoriesStore.categories"
          :key="category.id"
          class="hover:shadow-md transition-shadow cursor-pointer group"
          @click="editCategory(category)"
        >
          <CardContent class="p-6">
            <div class="flex items-start justify-between mb-4">
              <div
                class="w-12 h-12 rounded-lg flex items-center justify-center"
                :style="{ backgroundColor: category.color + '20' }"
              >
                <Folder
                  class="w-6 h-6"
                  :style="{ color: category.color }"
                />
              </div>
              <div class="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  @click.stop="editCategory(category)"
                >
                  <Edit2 class="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  @click.stop="confirmDeleteCategory(category)"
                  class="text-red-600 hover:text-red-700"
                >
                  <Trash2 class="w-4 h-4" />
                </Button>
              </div>
            </div>

            <h3 class="text-lg font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
              {{ category.name }}
            </h3>

            <p class="text-sm text-gray-500 mb-4 line-clamp-2">
              {{ category.description || 'Sem descrição' }}
            </p>

            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-500">
                {{ category.tasksCount || 0 }} tarefa(s)
              </span>
              <span
                class="px-2 py-1 rounded-full text-xs font-medium"
                :style="{ backgroundColor: category.color + '20', color: category.color }"
              >
                {{ category.name }}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Pagination -->
      <div
        v-if="categoriesStore.pagination.totalPages > 1"
        class="flex items-center justify-between"
      >
        <div class="text-sm text-gray-700">
          Mostrando {{ (categoriesStore.pagination.page - 1) * categoriesStore.pagination.limit + 1 }} a 
          {{ Math.min(categoriesStore.pagination.page * categoriesStore.pagination.limit, categoriesStore.pagination.total) }} 
          de {{ categoriesStore.pagination.total }} resultados
        </div>
        <div class="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            :disabled="categoriesStore.pagination.page === 1"
            @click="changePage(categoriesStore.pagination.page - 1)"
          >
            <ChevronLeft class="w-4 h-4" />
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            :disabled="categoriesStore.pagination.page === categoriesStore.pagination.totalPages"
            @click="changePage(categoriesStore.pagination.page + 1)"
          >
            Próxima
            <ChevronRight class="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>

    <!-- Category Form Dialog -->
    <CategoryFormDialog
      :is-open="showCategoryDialog"
      :category="selectedCategory"
      @close="closeCategoryDialog"
      @saved="handleCategorySaved"
    />

    <!-- Confirm Delete Dialog -->
    <ConfirmDialog
      :is-open="showDeleteDialog"
      type="danger"
      title="Excluir Categoria"
      :message="`Tem certeza que deseja excluir a categoria '${categoryToDelete?.name}'? Todas as tarefas associadas ficarão sem categoria.`"
      confirm-text="Excluir"
      :loading="deleteLoading"
      @confirm="handleDeleteCategory"
      @cancel="closeDeleteDialog"
    />
  </TheContainer>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCategoriesStore } from '../stores/categories.js'
import { useToast } from '../composables/useToast.js'
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Folder,
  FolderPlus,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-vue-next'

// Components
import TheContainer from '../components/TheContainer.vue'
import Card from '../components/ui/Card.vue'
import CardContent from '../components/ui/CardContent.vue'
import Button from '../components/ui/Button.vue'
import BaseFormField from '../components/ui/BaseFormField.vue'
import ConfirmDialog from '../components/ui/ConfirmDialog.vue'
import CategoryFormDialog from '../components/CategoryFormDialog.vue'

const categoriesStore = useCategoriesStore()
const toast = useToast()

// Dialog states
const showCategoryDialog = ref(false)
const showDeleteDialog = ref(false)
const selectedCategory = ref(null)
const categoryToDelete = ref(null)
const deleteLoading = ref(false)

// Filters
const filters = ref({
  search: '',
  sortBy: 'name',
  sortOrder: 'asc'
})

const hasActiveFilters = computed(() => {
  return filters.value.search
})

// Debounced filter change
let filterTimeout = null
const handleFilterChange = () => {
  clearTimeout(filterTimeout)
  filterTimeout = setTimeout(() => {
    categoriesStore.setFilters(filters.value)
    categoriesStore.fetchCategoriesWithStats()
  }, 300)
}

const resetFilters = () => {
  filters.value = {
    search: '',
    sortBy: 'name',
    sortOrder: 'asc'
  }
  categoriesStore.resetFilters()
  categoriesStore.fetchCategoriesWithStats()
}

const toggleSortOrder = () => {
  filters.value.sortOrder = filters.value.sortOrder === 'asc' ? 'desc' : 'asc'
  handleFilterChange()
}

const changePage = (page) => {
  categoriesStore.setPage(page)
  categoriesStore.fetchCategoriesWithStats()
}

// Category operations
const openCreateDialog = () => {
  selectedCategory.value = null
  showCategoryDialog.value = true
}

const editCategory = (category) => {
  selectedCategory.value = category
  showCategoryDialog.value = true
}

const closeCategoryDialog = () => {
  showCategoryDialog.value = false
  selectedCategory.value = null
}

const handleCategorySaved = () => {
  closeCategoryDialog()
  categoriesStore.fetchCategoriesWithStats()
  toast.success(selectedCategory.value ? 'Categoria atualizada com sucesso!' : 'Categoria criada com sucesso!')
}

const confirmDeleteCategory = (category) => {
  categoryToDelete.value = category
  showDeleteDialog.value = true
}

const closeDeleteDialog = () => {
  showDeleteDialog.value = false
  categoryToDelete.value = null
  deleteLoading.value = false
}

const handleDeleteCategory = async () => {
  try {
    deleteLoading.value = true
    await categoriesStore.deleteCategory(categoryToDelete.value.id)
    toast.success('Categoria excluída com sucesso!')
    closeDeleteDialog()
  } catch (error) {
    toast.error('Erro ao excluir categoria')
    deleteLoading.value = false
  }
}

// Initialize
onMounted(() => {
  categoriesStore.fetchCategoriesWithStats()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
