<template>
  <div class="relative" ref="comboboxRef">
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-2">
      {{ label }}
    </label>
    
    <div class="relative">
      <input
        ref="inputRef"
        v-model="searchQuery"
        type="text"
        :placeholder="placeholder"
        @input="handleSearch"
        @focus="isOpen = true"
        @keydown="handleKeydown"
        class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
        :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-500': error }"
      />
      
      <div class="absolute inset-y-0 right-0 flex items-center pr-2">
        <ChevronDown 
          class="h-4 w-4 text-gray-400 transition-transform duration-200"
          :class="{ 'rotate-180': isOpen }"
        />
      </div>
    </div>

    <!-- Selected Users Preview -->
    <div v-if="selectedUsers.length > 0" class="mt-3 flex flex-wrap gap-2">
      <div
        v-for="user in selectedUsers"
        :key="user.id"
        class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-sm"
      >
        <div class="h-5 w-5 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-medium">
          {{ getInitials(user.name) }}
        </div>
        <span>{{ user.name }}</span>
        <button
          @click="removeUser(user)"
          type="button"
          class="ml-1 hover:bg-purple-200 rounded-full p-0.5"
        >
          <X class="h-3 w-3" />
        </button>
      </div>
    </div>

    <!-- Dropdown -->
    <div
      v-if="isOpen"
      class="absolute z-50 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none"
    >
      <!-- Loading State -->
      <div v-if="loading" class="px-3 py-2 text-gray-500 text-sm">
        <div class="flex items-center">
          <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 mr-2"></div>
          Buscando usuários...
        </div>
      </div>

      <!-- No Results -->
      <div v-else-if="filteredUsers.length === 0" class="px-3 py-2 text-gray-500 text-sm">
        {{ searchQuery ? 'Nenhum usuário encontrado' : 'Digite para buscar usuários' }}
      </div>

      <!-- Users List -->
      <div
        v-for="(user, index) in filteredUsers"
        :key="user.id"
        @click="selectUser(user)"
        @mouseenter="highlightedIndex = index"
        class="cursor-pointer select-none relative px-3 py-2 hover:bg-gray-100"
        :class="{
          'bg-purple-100': highlightedIndex === index,
          'opacity-50': isUserSelected(user)
        }"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <div class="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center text-white text-sm font-medium mr-3">
              {{ getInitials(user.name) }}
            </div>
            <div>
              <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
              <div class="text-xs text-gray-500">{{ user.email }}</div>
            </div>
          </div>
          <Check 
            v-if="isUserSelected(user)" 
            class="h-4 w-4 text-purple-600" 
          />
        </div>
      </div>
    </div>

    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { ChevronDown, X, Check } from 'lucide-vue-next'
import { useAuthStore } from '../stores/auth/auth.js'

const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Buscar usuários...'
  },
  modelValue: {
    type: Array,
    default: () => []
  },
  multiple: {
    type: Boolean,
    default: true
  },
  exclude: {
    type: Array,
    default: () => []
  },
  error: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const authStore = useAuthStore()

// State
const searchQuery = ref('')
const isOpen = ref(false)
const loading = ref(false)
const highlightedIndex = ref(-1)
const comboboxRef = ref(null)
const inputRef = ref(null)

// Computed
const selectedUsers = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const availableUsers = computed(() => authStore.availableUsers || [])

const filteredUsers = computed(() => {
  let users = availableUsers.value

  // Exclude specified users (like current user)
  if (props.exclude.length > 0) {
    users = users.filter(user => !props.exclude.includes(user.id))
  }

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    users = users.filter(user => 
      user.name.toLowerCase().includes(query) || 
      user.email.toLowerCase().includes(query)
    )
  }

  return users.slice(0, 10) // Limit results
})

// Methods
const getInitials = (name) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const isUserSelected = (user) => {
  return selectedUsers.value.some(selected => selected.id === user.id)
}

const selectUser = (user) => {
  if (isUserSelected(user)) {
    if (props.multiple) {
      removeUser(user)
    }
    return
  }

  let newValue
  if (props.multiple) {
    newValue = [...selectedUsers.value, user]
  } else {
    newValue = [user]
    isOpen.value = false
    searchQuery.value = user.name
  }

  selectedUsers.value = newValue
  emit('change', newValue)

  if (props.multiple) {
    searchQuery.value = ''
    inputRef.value?.focus()
  }
}

const removeUser = (user) => {
  const newValue = selectedUsers.value.filter(selected => selected.id !== user.id)
  selectedUsers.value = newValue
  emit('change', newValue)
}

const handleSearch = async () => {
  if (!authStore.availableUsers.length) {
    await loadUsers()
  }
}

const loadUsers = async () => {
  try {
    loading.value = true
    await authStore.fetchUsers()
  } catch (error) {
    console.error('Erro ao carregar usuários:', error)
  } finally {
    loading.value = false
  }
}

const handleKeydown = (event) => {
  if (!isOpen.value) {
    if (event.key === 'ArrowDown' || event.key === 'Enter') {
      isOpen.value = true
      event.preventDefault()
    }
    return
  }

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      highlightedIndex.value = Math.min(
        highlightedIndex.value + 1,
        filteredUsers.value.length - 1
      )
      break

    case 'ArrowUp':
      event.preventDefault()
      highlightedIndex.value = Math.max(highlightedIndex.value - 1, -1)
      break

    case 'Enter':
      event.preventDefault()
      if (highlightedIndex.value >= 0 && filteredUsers.value[highlightedIndex.value]) {
        selectUser(filteredUsers.value[highlightedIndex.value])
      }
      break

    case 'Escape':
      isOpen.value = false
      inputRef.value?.blur()
      break

    case 'Backspace':
      if (!searchQuery.value && selectedUsers.value.length > 0 && props.multiple) {
        removeUser(selectedUsers.value[selectedUsers.value.length - 1])
      }
      break
  }
}

const handleClickOutside = (event) => {
  if (comboboxRef.value && !comboboxRef.value.contains(event.target)) {
    isOpen.value = false
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  loadUsers()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Watch for search query changes
watch(searchQuery, () => {
  highlightedIndex.value = -1
  if (searchQuery.value && !isOpen.value) {
    isOpen.value = true
  }
})
</script>
