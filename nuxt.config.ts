// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css'],
  
  // Настройки для GitHub Pages
  // base будет автоматически определен при деплое
  app: {
    baseURL: process.env.NUXT_APP_BASE_URL || '/',
    head: {
      title: 'Портфолио - Кирилл Фирсов',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Портфолио архитектора и Go-разработчика Кирилла Фирсова' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },
  
  // Для статической генерации
  nitro: {
    prerender: {
      routes: ['/api/works'],
      crawlLinks: true
    }
  },
  
  // Копируем папку works в public при генерации
  hooks: {
    'nitro:build:before': async (nitro) => {
      const { copyFileSync, existsSync, mkdirSync, readdirSync } = await import('fs')
      const { join } = await import('path')
      
      const worksDir = join(process.cwd(), 'works')
      const publicWorksDir = join(process.cwd(), 'public', 'works')
      
      if (existsSync(worksDir)) {
        // Создаем директорию если её нет
        if (!existsSync(publicWorksDir)) {
          mkdirSync(publicWorksDir, { recursive: true })
        }
        
        // Рекурсивно копируем файлы
        function copyRecursive(src: string, dest: string) {
          const entries = readdirSync(src, { withFileTypes: true })
          
          for (const entry of entries) {
            const srcPath = join(src, entry.name)
            const destPath = join(dest, entry.name)
            
            if (entry.isDirectory()) {
              if (!existsSync(destPath)) {
                mkdirSync(destPath, { recursive: true })
              }
              copyRecursive(srcPath, destPath)
            } else {
              copyFileSync(srcPath, destPath)
            }
          }
        }
        
        copyRecursive(worksDir, publicWorksDir)
        console.log('Copied works directory to public')
      }
    }
  }
})

