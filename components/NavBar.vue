<template>
  <nav class="bg-white shadow-md sticky top-0 z-50">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        <NuxtLink to="herzen-7-sem-portfolio/" class="text-2xl font-bold text-primary-600">
          Портфолио
        </NuxtLink>
        <div class="flex space-x-6">
          <NuxtLink
            to="/"
            class="text-gray-700 hover:text-primary-600 transition-colors font-medium"
            active-class="text-primary-600"
          >
            Обо мне
          </NuxtLink>
          <NuxtLink
            to="/herzen-7-sem-portfolio/works"
            class="text-gray-700 hover:text-primary-600 transition-colors font-medium"
            active-class="text-primary-600"
          >
            Мои работы в вузе
          </NuxtLink>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
</script>

