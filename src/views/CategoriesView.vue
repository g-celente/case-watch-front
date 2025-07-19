<template>
  <div class="space-y-6">
    <div class="text-center py-12">
      <FolderOpen class="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Categorias</h1>
      <p class="text-gray-600 dark:text-gray-400">
        Organize suas tarefas por categorias
      </p>
      <div class="mt-6">
        <Button class="bg-primary hover:bg-primary/90">
          <Plus class="w-4 h-4 mr-2" />
          Nova Categoria
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { FolderOpen, Plus } from 'lucide-vue-next'
import Button from '../components/ui/Button.vue'
</script>
