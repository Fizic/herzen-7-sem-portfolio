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
  
  // Копируем папку works в public при генерации и создаем JSON список
  hooks: {
    'nitro:build:before': async (nitro) => {
      const { copyFileSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } = await import('fs')
      const { join } = await import('path')
      
      const worksDir = join(process.cwd(), 'works')
      const publicWorksDir = join(process.cwd(), 'public', 'works')
      const publicApiDir = join(process.cwd(), 'public', 'api')
      
      // Создаем директорию для API если её нет
      if (!existsSync(publicApiDir)) {
        mkdirSync(publicApiDir, { recursive: true })
      }
      
      // Функция для чтения директории и создания структуры
      async function readDirectory(dirPath: string, relativePath: string = ''): Promise<any[]> {
        try {
          const items: any[] = []
          const entries = readdirSync(dirPath, { withFileTypes: true })

          for (const entry of entries) {
            // Пропускаем скрытые файлы и .gitkeep
            if (entry.name.startsWith('.')) {
              continue
            }

            const fullPath = join(dirPath, entry.name)
            const itemPath = relativePath ? `${relativePath}/${entry.name}` : entry.name
            const stats = statSync(fullPath)

            if (entry.isDirectory()) {
              const children = await readDirectory(fullPath, itemPath)
              items.push({
                name: entry.name,
                type: 'folder',
                path: itemPath,
                children
              })
            } else {
              items.push({
                name: entry.name,
                type: 'file',
                path: itemPath,
                size: stats.size
              })
            }
          }

          // Сортируем: сначала папки, потом файлы
          return items.sort((a, b) => {
            if (a.type === 'folder' && b.type === 'file') return -1
            if (a.type === 'file' && b.type === 'folder') return 1
            return a.name.localeCompare(b.name)
          })
        } catch (error) {
          console.error(`Error reading directory ${dirPath}:`, error)
          return []
        }
      }
      
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
        
        // Генерируем JSON список файлов
        const files = await readDirectory(worksDir)
        const jsonPath = join(publicApiDir, 'works.json')
        writeFileSync(jsonPath, JSON.stringify(files, null, 2))
        console.log(`Generated works list with ${files.length} items`)
      } else {
        // Если папки works нет, создаем пустой JSON
        const jsonPath = join(publicApiDir, 'works.json')
        writeFileSync(jsonPath, JSON.stringify([], null, 2))
        console.log('Works directory does not exist, created empty list')
      }
    }
  }
})

