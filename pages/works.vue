<template>
  <div class="max-w-6xl mx-auto">
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-4xl font-bold text-gray-900">Мои работы в вузе</h1>
      <button
        @click="loadFiles"
        :disabled="loading"
        class="btn-secondary flex items-center gap-2"
      >
        <svg
          class="w-5 h-5"
          :class="{ 'animate-spin': loading }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        Обновить
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="card text-center py-12">
      <svg class="w-12 h-12 mx-auto text-primary-600 animate-spin mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      <p class="text-gray-600">Загрузка файлов...</p>
    </div>

    <!-- Files Display -->
    <div v-else-if="files.length > 0" class="space-y-4">
      <h2 class="text-2xl font-bold mb-4 text-gray-900">Работы</h2>

      <div class="card">
        <div class="bg-gray-50 rounded-lg p-4">
          <FileTree :files="files" />
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="card text-center py-12">
      <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <p class="text-gray-500 text-lg mb-2">Пока нет загруженных работ</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

useHead({
  title: 'Мои работы в вузе - Портфолио Кирилла Фирсова'
})

const files = ref([])
const loading = ref(false)

// Load files from server
const loadFiles = async () => {
  loading.value = true
  try {
    const data = await $fetch('/api/works')
    files.value = data || []
  } catch (error) {
    console.error('Error loading files:', error)
    files.value = []
  } finally {
    loading.value = false
  }
}

// Load files on mount
onMounted(() => {
  loadFiles()
})
</script>

