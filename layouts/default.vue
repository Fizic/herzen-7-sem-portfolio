<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <NavBar />
    <main class="container mx-auto px-4 py-8">
      <slot />
    </main>
    <footer class="bg-gray-800 text-white py-6 mt-12">
      <div class="container mx-auto px-4 text-center">
        <p>&copy; 2025 Кирилл Фирсов. Все права защищены.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
</script>

