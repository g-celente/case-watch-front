<template>
  <teleport to="body">
    <div class="fixed top-4 right-4 z-50 space-y-2">
      <BaseToast
        v-for="toast in toasts"
        :key="toast.id"
        :type="toast.type"
        :title="toast.title"
        :message="toast.message"
        :duration="toast.duration"
        :persistent="toast.persistent"
        @close="removeToast(toast.id)"
      />
    </div>
  </teleport>
</template>

<script setup>
import { useToast } from '../composables/useToast.js'
import BaseToast from './ui/BaseToast.vue'

const { toasts, removeToast } = useToast()
</script>
