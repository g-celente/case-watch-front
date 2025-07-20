<template>
  <div class="bg-white rounded-lg border border-gray-200 p-6">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-semibold text-gray-900">Colaboração</h3>
      <button
        v-if="canManageCollaborators"
        @click="showAddCollaborator = true"
        class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
      >
        <Plus class="h-4 w-4 mr-2" />
        Adicionar Colaborador
      </button>
    </div>

    <!-- Assignee Section -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-3">
        <h4 class="text-sm font-medium text-gray-900 flex items-center">
          <Pin class="h-4 w-4 mr-2 text-purple-600" />
          Responsável
        </h4>
        <button
          v-if="canAssign && !assignee"
          @click="showAssignUser = true"
          class="text-sm text-purple-600 hover:text-purple-700"
        >
          Atribuir
        </button>
      </div>
      
      <div v-if="assignee" class="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
        <div class="flex items-center">
          <div class="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-medium">
            {{ getInitials(assignee.name) }}
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-900">{{ assignee.name }}</p>
            <p class="text-xs text-gray-500">{{ assignee.email }}</p>
          </div>
        </div>
        <button
          v-if="canAssign"
          @click="handleUnassign"
          class="text-sm text-red-600 hover:text-red-700"
          :disabled="loading"
        >
          Remover
        </button>
      </div>
      
      <div v-else class="p-3 bg-gray-50 rounded-lg border border-gray-200 text-center">
        <p class="text-sm text-gray-500">Nenhum responsável atribuído</p>
      </div>
    </div>

    <!-- Collaborators Section -->
    <div>
      <h4 class="text-sm font-medium text-gray-900 mb-3 flex items-center">
        <Users class="h-4 w-4 mr-2 text-purple-600" />
        Colaboradores ({{ collaborators.length }})
      </h4>
      
      <div v-if="collaborators.length > 0" class="space-y-3">
        <div
          v-for="collaborator in collaborators"
          :key="collaborator.id"
          class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
        >
          <div class="flex items-center">
            <div class="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center text-white text-sm font-medium">
              {{ getInitials(collaborator.name) }}
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-900">{{ collaborator.name }}</p>
              <p class="text-xs text-gray-500">{{ collaborator.email }}</p>
            </div>
          </div>
          
          <div class="flex items-center space-x-2">
            <span :class="getRoleBadgeClass(collaborator.role)" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium">
              {{ getRoleIcon(collaborator.role) }} {{ getRoleLabel(collaborator.role) }}
            </span>
            <button
              v-if="canManageCollaborators && collaborator.role !== 'OWNER'"
              @click="handleRemoveCollaborator(collaborator.id)"
              class="text-sm text-red-600 hover:text-red-700"
              :disabled="loading"
            >
              <X class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      
      <div v-else class="p-3 bg-gray-50 rounded-lg border border-gray-200 text-center">
        <p class="text-sm text-gray-500">Nenhum colaborador adicionado</p>
      </div>
    </div>

    <!-- Add Collaborator Modal -->
    <BaseDialog
      :is-open="showAddCollaborator"
      title="Adicionar Colaborador"
      size="md"
      @close="showAddCollaborator = false"
    >
      <form @submit.prevent="handleAddCollaborator" class="space-y-4">
        <BaseFormField
          v-model="selectedUserId"
          label="Usuário"
          type="select"
          :options="availableUsersOptions"
          placeholder="Selecione um usuário"
          required
        />
        
        <BaseFormField
          v-model="selectedRole"
          label="Nível de Acesso"
          type="select"
          :options="roleOptions"
          required
        />
        
        <div class="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            @click="showAddCollaborator = false"
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="loading || !selectedUserId || !selectedRole"
            class="px-4 py-2 bg-purple-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50"
          >
            {{ loading ? 'Adicionando...' : 'Adicionar' }}
          </button>
        </div>
      </form>
    </BaseDialog>

    <!-- Assign User Modal -->
    <BaseDialog
      :is-open="showAssignUser"
      title="Atribuir Responsável"
      size="md"
      @close="showAssignUser = false"
    >
      <form @submit.prevent="handleAssign" class="space-y-4">
        <BaseFormField
          v-model="selectedAssigneeId"
          label="Responsável"
          type="select"
          :options="assignableUsersOptions"
          placeholder="Selecione um responsável"
          required
        />
        
        <div class="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            @click="showAssignUser = false"
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="loading || !selectedAssigneeId"
            class="px-4 py-2 bg-purple-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50"
          >
            {{ loading ? 'Atribuindo...' : 'Atribuir' }}
          </button>
        </div>
      </form>
    </BaseDialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Plus, Users, Pin, X } from 'lucide-vue-next'
import { useTasksStore } from '../../stores/tasks.js'
import { useAuthStore } from '../../stores/auth/auth.js'
import { useToast } from '../../composables/useToast.js'
import BaseDialog from '../ui/BaseDialog.vue'
import BaseFormField from '../ui/BaseFormField.vue'

const props = defineProps({
  taskId: {
    type: String,
    required: true
  }
})

const tasksStore = useTasksStore()
const authStore = useAuthStore()
const { showToast } = useToast()

// State
const showAddCollaborator = ref(false)
const showAssignUser = ref(false)
const selectedUserId = ref('')
const selectedRole = ref('VIEWER')
const selectedAssigneeId = ref('')

// Getters
const collaborators = computed(() => tasksStore.collaborators)
const assignee = computed(() => tasksStore.assignee)
const userPermissions = computed(() => tasksStore.userPermissions)
const loading = computed(() => tasksStore.loading)
const availableUsers = computed(() => authStore.availableUsers)

const canManageCollaborators = computed(() => 
  userPermissions.value.canManageCollaborators || userPermissions.value.currentUserRole === 'OWNER'
)

const canAssign = computed(() => 
  userPermissions.value.canAssign || ['OWNER', 'ADMIN'].includes(userPermissions.value.currentUserRole)
)

const availableUsersOptions = computed(() => 
  availableUsers.value
    .filter(user => 
      !collaborators.value.some(collab => collab.id === user.id) && 
      user.id !== authStore.currentUser?.id
    )
    .map(user => ({
      value: user.id,
      label: `${user.name} (${user.email})`
    }))
)

const assignableUsersOptions = computed(() => 
  collaborators.value
    .filter(collab => collab.role !== 'VIEWER')
    .map(collab => ({
      value: collab.id,
      label: `${collab.name} (${collab.email})`
    }))
)

const roleOptions = [
  { value: 'VIEWER', label: '👁️ Visualizar' },
  { value: 'EDITOR', label: '✏️ Editor' },
  { value: 'ADMIN', label: '⚙️ Administrador' }
]

// Methods
const getInitials = (name) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const getRoleIcon = (role) => {
  const icons = {
    'OWNER': '👑',
    'ADMIN': '⚙️',
    'EDITOR': '✏️',
    'VIEWER': '👁️'
  }
  return icons[role] || '👁️'
}

const getRoleLabel = (role) => {
  const labels = {
    'OWNER': 'Proprietário',
    'ADMIN': 'Administrador',
    'EDITOR': 'Editor',
    'VIEWER': 'Visualizador'
  }
  return labels[role] || 'Visualizador'
}

const getRoleBadgeClass = (role) => {
  const classes = {
    'OWNER': 'bg-purple-100 text-purple-800',
    'ADMIN': 'bg-red-100 text-red-800',
    'EDITOR': 'bg-blue-100 text-blue-800',
    'VIEWER': 'bg-gray-100 text-gray-800'
  }
  return classes[role] || 'bg-gray-100 text-gray-800'
}

const handleAddCollaborator = async () => {
  try {
    await tasksStore.addCollaborator(props.taskId, selectedUserId.value, selectedRole.value)
    showToast('Colaborador adicionado com sucesso!', 'success')
    showAddCollaborator.value = false
    selectedUserId.value = ''
    selectedRole.value = 'VIEWER'
  } catch (error) {
    showToast('Erro ao adicionar colaborador', 'error')
  }
}

const handleRemoveCollaborator = async (userId) => {
  if (confirm('Tem certeza que deseja remover este colaborador?')) {
    try {
      await tasksStore.removeCollaborator(props.taskId, userId)
      showToast('Colaborador removido com sucesso!', 'success')
    } catch (error) {
      showToast('Erro ao remover colaborador', 'error')
    }
  }
}

const handleAssign = async () => {
  try {
    await tasksStore.assignTask(props.taskId, selectedAssigneeId.value)
    showToast('Responsável atribuído com sucesso!', 'success')
    showAssignUser.value = false
    selectedAssigneeId.value = ''
  } catch (error) {
    showToast('Erro ao atribuir responsável', 'error')
  }
}

const handleUnassign = async () => {
  if (confirm('Tem certeza que deseja remover o responsável?')) {
    try {
      await tasksStore.unassignTask(props.taskId)
      showToast('Responsável removido com sucesso!', 'success')
    } catch (error) {
      showToast('Erro ao remover responsável', 'error')
    }
  }
}

// Lifecycle
onMounted(async () => {
  await authStore.fetchUsers()
})
</script>
