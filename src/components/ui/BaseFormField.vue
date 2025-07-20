<template>
  <div class="space-y-2">
    <label
      v-if="label"
      :for="fieldId"
      class="block text-sm font-medium text-gray-700"
      :class="{ 'text-red-700': error }"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <div class="relative">
      <slot :fieldId="fieldId" :hasError="!!error">
        <!-- Default input -->
        <input
          :id="fieldId"
          v-model="inputValue"
          :type="type"
          :placeholder="placeholder"
          :disabled="disabled"
          :required="required"
          class="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 disabled:bg-gray-50 disabled:text-gray-500"
          :class="{
            'border-red-300 focus:border-red-500 focus:ring-red-500': error,
            'pr-10': error
          }"
          @blur="$emit('blur')"
          @focus="$emit('focus')"
        />
      </slot>
      
      <!-- Error icon -->
      <div v-if="error" class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <AlertCircle class="h-5 w-5 text-red-500" />
      </div>
    </div>
    
    <p v-if="error" class="text-sm text-red-600">
      {{ error }}
    </p>
    
    <p v-else-if="hint" class="text-sm text-gray-500">
      {{ hint }}
    </p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { AlertCircle } from 'lucide-vue-next'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  },
  hint: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'blur', 'focus'])

const fieldId = `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

const inputValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})
</script>
