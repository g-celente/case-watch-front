<template>
  <transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0 translate-y-2"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-2"
  >
    <div
      v-if="isVisible"
      class="fixed bottom-4 right-4 z-50 max-w-sm w-full"
    >
      <div
        class="rounded-lg shadow-lg border border-gray-200 bg-white p-4"
        :class="typeClasses"
      >
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <component :is="iconComponent" class="h-5 w-5" :class="iconClasses" />
          </div>
          <div class="ml-3 flex-1">
            <h4 v-if="title" class="text-sm font-medium" :class="titleClasses">
              {{ title }}
            </h4>
            <p class="text-sm" :class="messageClasses">
              {{ message }}
            </p>
          </div>
          <div class="ml-4 flex-shrink-0">
            <button
              @click="close"
              class="rounded-md inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <X class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-vue-next'

const props = defineProps({
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
  },
  title: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    default: 5000
  },
  persistent: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const isVisible = ref(false)

const iconComponent = computed(() => {
  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info
  }
  return icons[props.type]
})

const typeClasses = computed(() => {
  const classes = {
    success: 'border-green-200',
    error: 'border-red-200',
    warning: 'border-yellow-200',
    info: 'border-blue-200'
  }
  return classes[props.type]
})

const iconClasses = computed(() => {
  const classes = {
    success: 'text-green-500',
    error: 'text-red-500',
    warning: 'text-yellow-500',
    info: 'text-blue-500'
  }
  return classes[props.type]
})

const titleClasses = computed(() => {
  const classes = {
    success: 'text-green-800',
    error: 'text-red-800',
    warning: 'text-yellow-800',
    info: 'text-blue-800'
  }
  return classes[props.type]
})

const messageClasses = computed(() => {
  const classes = {
    success: 'text-green-700',
    error: 'text-red-700',
    warning: 'text-yellow-700',
    info: 'text-blue-700'
  }
  return classes[props.type]
})

const close = () => {
  isVisible.value = false
  emit('close')
}

let timeoutId = null

const startTimer = () => {
  if (!props.persistent && props.duration > 0) {
    timeoutId = setTimeout(() => {
      close()
    }, props.duration)
  }
}

const clearTimer = () => {
  if (timeoutId) {
    clearTimeout(timeoutId)
    timeoutId = null
  }
}

watch(() => props.duration, () => {
  clearTimer()
  startTimer()
})

onMounted(() => {
  isVisible.value = true
  startTimer()
})
</script>
