<template>
  <div id="app" class="min-h-screen bg-white text-gray-900">
    <router-view />
    <ToastContainer />
  </div>
</template>

<script setup>
import ToastContainer from './components/ToastContainer.vue'
</script>

<style>
#app {
  background-color: white;
  color: #111827;
}
</style>
