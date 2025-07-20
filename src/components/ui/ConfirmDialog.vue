<template>
  <BaseDialog
    :is-open="isOpen"
    :title="title"
    size="sm"
    :close-on-backdrop="false"
    :show-close-button="false"
    @close="cancel"
  >
    <div class="text-center">
      <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full mb-4"
           :class="iconBgClass">
        <component :is="iconComponent" class="h-6 w-6" :class="iconClass" />
      </div>
      
      <h3 class="text-lg font-medium text-gray-900 mb-2">
        {{ title }}
      </h3>
      
      <p class="text-sm text-gray-500 mb-6">
        {{ message }}
      </p>
    </div>

    <template #footer>
      <div class="flex justify-end space-x-3">
        <Button
          variant="outline"
          @click="cancel"
          :disabled="loading"
        >
          {{ cancelText }}
        </Button>
        <Button
          :variant="confirmVariant"
          @click="confirm"
          :loading="loading"
        >
          {{ confirmText }}
        </Button>
      </div>
    </template>
  </BaseDialog>
</template>

<script setup>
import { computed } from 'vue'
import { AlertTriangle, Trash2, Check, Info } from 'lucide-vue-next'
import BaseDialog from './BaseDialog.vue'
import Button from './Button.vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'warning',
    validator: (value) => ['warning', 'danger', 'success', 'info'].includes(value)
  },
  title: {
    type: String,
    default: 'Confirmar ação'
  },
  message: {
    type: String,
    default: 'Tem certeza que deseja realizar esta ação?'
  },
  confirmText: {
    type: String,
    default: 'Confirmar'
  },
  cancelText: {
    type: String,
    default: 'Cancelar'
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['confirm', 'cancel'])

const iconComponent = computed(() => {
  const icons = {
    warning: AlertTriangle,
    danger: Trash2,
    success: Check,
    info: Info
  }
  return icons[props.type]
})

const iconClass = computed(() => {
  const classes = {
    warning: 'text-yellow-600',
    danger: 'text-red-600',
    success: 'text-green-600',
    info: 'text-blue-600'
  }
  return classes[props.type]
})

const iconBgClass = computed(() => {
  const classes = {
    warning: 'bg-yellow-100',
    danger: 'bg-red-100',
    success: 'bg-green-100',
    info: 'bg-blue-100'
  }
  return classes[props.type]
})

const confirmVariant = computed(() => {
  const variants = {
    warning: 'warning',
    danger: 'destructive',
    success: 'default',
    info: 'default'
  }
  return variants[props.type]
})

const confirm = () => {
  emit('confirm')
}

const cancel = () => {
  emit('cancel')
}
</script>
