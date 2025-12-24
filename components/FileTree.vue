<template>
  <ul class="space-y-1">
    <li v-for="(item, index) in files" :key="index" class="pl-4">
      <div class="flex items-center gap-2 py-1.5 hover:bg-gray-100 rounded px-2 -ml-2 group">
        <!-- Chevron для папок -->
        <button
          v-if="item.type === 'folder'"
          @click="toggleFolder(index)"
          type="button"
          class="flex items-center justify-center w-4 h-4 text-gray-500 hover:text-gray-700 transition-colors flex-shrink-0"
          :title="isExpanded(index) ? 'Свернуть' : 'Развернуть'"
        >
          <svg
            class="w-3 h-3 transition-transform"
            :class="{ 'rotate-90': isExpanded(index) }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
        <span v-else class="w-4"></span>
        
        <!-- Иконка папки или файла -->
        <svg
          v-if="item.type === 'folder'"
          class="w-4 h-4 text-gray-500 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
          />
        </svg>
        <svg
          v-else
          class="w-4 h-4 text-gray-400 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        
        <!-- Имя папки или файла -->
        <span v-if="item.type === 'folder'" class="text-sm text-gray-700 font-medium flex items-center gap-1 cursor-pointer" @click="toggleFolder(index)">
          {{ item.name }}
        </span>
        <button
          v-else
          @click="downloadFile(item.path, item.name)"
          type="button"
          class="text-sm text-gray-700 hover:text-primary-600 transition-colors flex items-center gap-2 cursor-pointer bg-transparent border-none p-0 text-left flex-1 min-w-0"
          :title="`Скачать ${item.name}`"
        >
          <span class="truncate flex-1">{{ item.name }}</span>
          <svg class="w-4 h-4 text-primary-500 opacity-60 group-hover:opacity-100 transition-opacity flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </button>
        <span v-if="item.type === 'file' && item.size" class="text-xs text-gray-500 ml-2 flex-shrink-0">
          {{ formatFileSize(item.size) }}
        </span>
      </div>
      <!-- Дочерние элементы показываются только если папка развернута -->
      <div v-if="item.type === 'folder' && isExpanded(index)" class="ml-4">
        <FileTree v-if="item.children && item.children.length > 0" :files="item.children" />
      </div>
    </li>
  </ul>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  files: {
    type: Array,
    required: true
  }
})

// Храним состояние развернутости папок
// Используем Set для хранения путей развернутых папок
const expandedFolders = ref(new Set())

// Генерируем уникальный ключ для папки на основе её пути
const getFolderKey = (item) => {
  // Используем путь папки как уникальный ключ
  return item.path || item.name
}

const isExpanded = (index) => {
  const item = props.files[index]
  if (item.type !== 'folder') return false
  const key = getFolderKey(item)
  return expandedFolders.value.has(key)
}

const toggleFolder = (index) => {
  const item = props.files[index]
  if (item.type !== 'folder') return
  
  const key = getFolderKey(item)
  if (expandedFolders.value.has(key)) {
    expandedFolders.value.delete(key)
  } else {
    expandedFolders.value.add(key)
  }
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

const downloadFile = async (filePath, fileName) => {
  try {
    // Убеждаемся, что путь не пустой
    if (!filePath || !fileName) {
      throw new Error('Неверный путь к файлу')
    }
    
    // Для catch-all маршрута каждый сегмент пути кодируется отдельно
    // Убираем пустые сегменты и кодируем каждый
    const pathSegments = filePath
      .split('/')
      .filter(segment => segment && segment.trim() !== '')
      .map(segment => encodeURIComponent(segment))
    
    if (pathSegments.length === 0) {
      throw new Error('Путь к файлу пуст')
    }
    
    // Получаем baseURL из конфигурации
    const config = useRuntimeConfig()
    const baseURL = config.public.baseURL || ''
    
    // Пытаемся использовать API endpoint, если недоступен - используем прямой путь к файлу
    let url = `${baseURL}/api/works/${pathSegments.join('/')}`
    
    console.log('Downloading file:', { filePath, fileName, url, baseURL })
    
    let response = await fetch(url)
    
    // Если API недоступен (404), пробуем прямой путь к файлу в works/
    if (!response.ok && response.status === 404) {
      url = `${baseURL}/works/${pathSegments.join('/')}`
      response = await fetch(url)
    }
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => response.statusText)
      throw new Error(`Ошибка ${response.status}: ${errorText}`)
    }
    
    const blob = await response.blob()
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = fileName
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    
    // Небольшая задержка перед удалением, чтобы браузер успел начать скачивание
    setTimeout(() => {
      if (document.body.contains(link)) {
        document.body.removeChild(link)
      }
      window.URL.revokeObjectURL(downloadUrl)
    }, 100)
  } catch (error) {
    console.error('Error downloading file:', error)
    alert(`Ошибка при скачивании файла "${fileName}": ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`)
  }
}
</script>

