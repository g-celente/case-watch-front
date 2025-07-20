<template>
  <transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95"
  >
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 overflow-y-auto"
      @click="handleBackdropClick"
    >
      <div class="flex min-h-full items-center justify-center p-4">
        <div
          class="fixed inset-0 bg-black bg-opacity-25 transition-opacity"
          aria-hidden="true"
        ></div>
        
        <div
          ref="dialogRef"
          class="relative transform overflow-hidden rounded-lg bg-white shadow-xl transition-all"
          :class="sizeClasses"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="titleId"
        >
          <!-- Header -->
          <div v-if="title || $slots.header" class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <slot name="header">
                <h3 :id="titleId" class="text-lg font-semibold text-gray-900">
                  {{ title }}
                </h3>
              </slot>
              <button
                v-if="showCloseButton"
                @click="close"
                class="rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <X class="h-5 w-5" />
              </button>
            </div>
          </div>

          <!-- Content -->
          <div class="px-6 py-4">
            <slot></slot>
          </div>

          <!-- Footer -->
          <div v-if="$slots.footer" class="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { X } from 'lucide-vue-next'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl', '2xl'].includes(value)
  },
  showCloseButton: {
    type: Boolean,
    default: true
  },
  closeOnBackdrop: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['close', 'opened', 'closed'])

const dialogRef = ref(null)
const titleId = `dialog-title-${Date.now()}`

const sizeClasses = {
  sm: 'max-w-md w-full',
  md: 'max-w-lg w-full',
  lg: 'max-w-2xl w-full',
  xl: 'max-w-4xl w-full',
  '2xl': 'max-w-6xl w-full'
}[props.size]

const close = () => {
  emit('close')
}

const handleBackdropClick = (event) => {
  if (props.closeOnBackdrop && event.target === event.currentTarget) {
    close()
  }
}

// Handle escape key
const handleEscape = (event) => {
  if (event.key === 'Escape' && props.isOpen) {
    close()
  }
}

// Focus management
watch(() => props.isOpen, async (isOpen) => {
  if (isOpen) {
    await nextTick()
    document.addEventListener('keydown', handleEscape)
    dialogRef.value?.focus()
    emit('opened')
  } else {
    document.removeEventListener('keydown', handleEscape)
    emit('closed')
  }
})
</script>
