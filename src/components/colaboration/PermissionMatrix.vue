<template>
  <div class="space-y-4">
    <!-- Current User Permissions -->
    <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
      <h4 class="text-sm font-medium text-purple-900 mb-3 flex items-center">
        <User class="h-4 w-4 mr-2" />
        Suas Permissões
      </h4>
      <div class="grid grid-cols-2 gap-3">
        <div class="flex items-center justify-between p-2 bg-white rounded border">
          <span class="text-sm text-gray-700 flex items-center">
            <Edit class="h-4 w-4 mr-2 text-gray-400" />
            Editar tarefa
          </span>
          <span v-if="userPermissions.canEdit" class="text-green-600">
            <Check class="h-4 w-4" />
          </span>
          <span v-else class="text-red-600">
            <X class="h-4 w-4" />
          </span>
        </div>
        
        <div class="flex items-center justify-between p-2 bg-white rounded border">
          <span class="text-sm text-gray-700 flex items-center">
            <Trash2 class="h-4 w-4 mr-2 text-gray-400" />
            Excluir tarefa
          </span>
          <span v-if="userPermissions.canDelete" class="text-green-600">
            <Check class="h-4 w-4" />
          </span>
          <span v-else class="text-red-600">
            <X class="h-4 w-4" />
          </span>
        </div>
        
        <div class="flex items-center justify-between p-2 bg-white rounded border">
          <span class="text-sm text-gray-700 flex items-center">
            <Users class="h-4 w-4 mr-2 text-gray-400" />
            Gerenciar colaboradores
          </span>
          <span v-if="userPermissions.canManageCollaborators" class="text-green-600">
            <Check class="h-4 w-4" />
          </span>
          <span v-else class="text-red-600">
            <X class="h-4 w-4" />
          </span>
        </div>
        
        <div class="flex items-center justify-between p-2 bg-white rounded border">
          <span class="text-sm text-gray-700 flex items-center">
            <Pin class="h-4 w-4 mr-2 text-gray-400" />
            Atribuir responsável
          </span>
          <span v-if="userPermissions.canAssign" class="text-green-600">
            <Check class="h-4 w-4" />
          </span>
          <span v-else class="text-red-600">
            <X class="h-4 w-4" />
          </span>
        </div>
      </div>
    </div>

    <!-- Permission Matrix Table -->
    <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nível de Acesso
            </th>
            <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Visualizar
            </th>
            <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Editar
            </th>
            <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Excluir
            </th>
            <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Colaboradores
            </th>
            <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Atribuir
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <!-- OWNER -->
          <tr class="bg-purple-50">
            <td class="px-4 py-3 whitespace-nowrap">
              <div class="flex items-center">
                <span class="text-lg mr-2">👑</span>
                <div>
                  <div class="text-sm font-medium text-gray-900">Proprietário</div>
                  <div class="text-xs text-gray-500">Controle total da tarefa</div>
                </div>
              </div>
            </td>
            <td class="px-4 py-3 text-center">
              <Check class="h-5 w-5 text-green-600 mx-auto" />
            </td>
            <td class="px-4 py-3 text-center">
              <Check class="h-5 w-5 text-green-600 mx-auto" />
            </td>
            <td class="px-4 py-3 text-center">
              <Check class="h-5 w-5 text-green-600 mx-auto" />
            </td>
            <td class="px-4 py-3 text-center">
              <Check class="h-5 w-5 text-green-600 mx-auto" />
            </td>
            <td class="px-4 py-3 text-center">
              <Check class="h-5 w-5 text-green-600 mx-auto" />
            </td>
          </tr>
          
          <!-- ADMIN -->
          <tr class="bg-red-50">
            <td class="px-4 py-3 whitespace-nowrap">
              <div class="flex items-center">
                <span class="text-lg mr-2">⚙️</span>
                <div>
                  <div class="text-sm font-medium text-gray-900">Administrador</div>
                  <div class="text-xs text-gray-500">Pode gerenciar colaboradores e editar</div>
                </div>
              </div>
            </td>
            <td class="px-4 py-3 text-center">
              <Check class="h-5 w-5 text-green-600 mx-auto" />
            </td>
            <td class="px-4 py-3 text-center">
              <Check class="h-5 w-5 text-green-600 mx-auto" />
            </td>
            <td class="px-4 py-3 text-center">
              <Check class="h-5 w-5 text-green-600 mx-auto" />
            </td>
            <td class="px-4 py-3 text-center">
              <Check class="h-5 w-5 text-green-600 mx-auto" />
            </td>
            <td class="px-4 py-3 text-center">
              <Check class="h-5 w-5 text-green-600 mx-auto" />
            </td>
          </tr>
          
          <!-- EDITOR -->
          <tr class="bg-blue-50">
            <td class="px-4 py-3 whitespace-nowrap">
              <div class="flex items-center">
                <span class="text-lg mr-2">✏️</span>
                <div>
                  <div class="text-sm font-medium text-gray-900">Editor</div>
                  <div class="text-xs text-gray-500">Pode editar conteúdo da tarefa</div>
                </div>
              </div>
            </td>
            <td class="px-4 py-3 text-center">
              <Check class="h-5 w-5 text-green-600 mx-auto" />
            </td>
            <td class="px-4 py-3 text-center">
              <Check class="h-5 w-5 text-green-600 mx-auto" />
            </td>
            <td class="px-4 py-3 text-center">
              <X class="h-5 w-5 text-red-600 mx-auto" />
            </td>
            <td class="px-4 py-3 text-center">
              <X class="h-5 w-5 text-red-600 mx-auto" />
            </td>
            <td class="px-4 py-3 text-center">
              <X class="h-5 w-5 text-red-600 mx-auto" />
            </td>
          </tr>
          
          <!-- VIEWER -->
          <tr class="bg-gray-50">
            <td class="px-4 py-3 whitespace-nowrap">
              <div class="flex items-center">
                <span class="text-lg mr-2">👁️</span>
                <div>
                  <div class="text-sm font-medium text-gray-900">Visualizador</div>
                  <div class="text-xs text-gray-500">Apenas visualizar</div>
                </div>
              </div>
            </td>
            <td class="px-4 py-3 text-center">
              <Check class="h-5 w-5 text-green-600 mx-auto" />
            </td>
            <td class="px-4 py-3 text-center">
              <X class="h-5 w-5 text-red-600 mx-auto" />
            </td>
            <td class="px-4 py-3 text-center">
              <X class="h-5 w-5 text-red-600 mx-auto" />
            </td>
            <td class="px-4 py-3 text-center">
              <X class="h-5 w-5 text-red-600 mx-auto" />
            </td>
            <td class="px-4 py-3 text-center">
              <X class="h-5 w-5 text-red-600 mx-auto" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Legend -->
    <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <h4 class="text-sm font-medium text-gray-900 mb-3 flex items-center">
        <Info class="h-4 w-4 mr-2" />
        Legenda
      </h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-600">
        <div class="flex items-center">
          <Check class="h-3 w-3 text-green-600 mr-2" />
          Permitido
        </div>
        <div class="flex items-center">
          <X class="h-3 w-3 text-red-600 mr-2" />
          Não permitido
        </div>
        <div class="flex items-center">
          <span class="inline-block w-3 h-3 bg-purple-100 mr-2 rounded"></span>
          Seu nível atual: {{ getRoleLabel(userPermissions.currentUserRole) }}
        </div>
        <div class="flex items-center">
          <AlertTriangle class="h-3 w-3 text-yellow-600 mr-2" />
          Confirmação necessária para ações destrutivas
        </div>
      </div>
    </div>

    <!-- Permission Tips -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h4 class="text-sm font-medium text-blue-900 mb-2 flex items-center">
        <Lightbulb class="h-4 w-4 mr-2" />
        Dicas de Permissão
      </h4>
      <ul class="text-xs text-blue-800 space-y-1">
        <li>• Apenas o proprietário pode excluir a tarefa permanentemente</li>
        <li>• Administradores podem promover outros usuários a administradores</li>
        <li>• Editores podem alterar status, prioridade e conteúdo da tarefa</li>
        <li>• Visualizadores recebem notificações de mudanças importantes</li>
        <li>• O responsável (assignee) pode ser qualquer colaborador Editor+</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { 
  Check, 
  X, 
  User, 
  Edit, 
  Trash2, 
  Users, 
  Pin, 
  Info, 
  AlertTriangle,
  Lightbulb
} from 'lucide-vue-next'

const props = defineProps({
  userPermissions: {
    type: Object,
    required: true,
    default: () => ({
      canEdit: false,
      canDelete: false,
      canManageCollaborators: false,
      canAssign: false,
      currentUserRole: 'VIEWER'
    })
  }
})

const getRoleLabel = (role) => {
  const labels = {
    'OWNER': 'Proprietário',
    'ADMIN': 'Administrador',
    'EDITOR': 'Editor',
    'VIEWER': 'Visualizador'
  }
  return labels[role] || 'Visualizador'
}
</script>
