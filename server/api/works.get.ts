import { readdir, stat } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

interface FileItem {
  name: string
  type: 'file' | 'folder'
  path: string
  size?: number
  children?: FileItem[]
}

export default defineEventHandler(async (event) => {
  const worksDir = join(process.cwd(), 'works')
  
  // Проверяем существование папки
  if (!existsSync(worksDir)) {
    return []
  }

  async function readDirectory(dirPath: string, relativePath: string = ''): Promise<FileItem[]> {
    try {
      const items: FileItem[] = []
      const entries = await readdir(dirPath)

      for (const entry of entries) {
        // Пропускаем скрытые файлы и .gitkeep
        if (entry.startsWith('.')) {
          continue
        }

        const fullPath = join(dirPath, entry)
        const itemPath = relativePath ? `${relativePath}/${entry}` : entry
        const stats = await stat(fullPath)

        if (stats.isDirectory()) {
          const children = await readDirectory(fullPath, itemPath)
          items.push({
            name: entry,
            type: 'folder',
            path: itemPath,
            children
          })
        } else {
          items.push({
            name: entry,
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

  const files = await readDirectory(worksDir)
  return files
})

