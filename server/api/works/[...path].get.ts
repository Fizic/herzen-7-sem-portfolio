import { readFile, stat } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export default defineEventHandler(async (event) => {
  // В Nuxt 3 catch-all параметры всегда массив
  const pathParam = getRouterParam(event, 'path')
  
  if (!pathParam) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Path is required'
    })
  }

  // pathParam всегда массив для catch-all маршрутов
  // Каждый сегмент уже декодирован, просто соединяем их
  const pathString = Array.isArray(pathParam) ? pathParam.join('/') : pathParam
  
  // Дополнительное декодирование на случай двойного кодирования
  let decodedPath: string
  try {
    decodedPath = decodeURIComponent(pathString)
  } catch {
    decodedPath = pathString
  }
  
  // Безопасность: проверяем, что путь не выходит за пределы works
  if (decodedPath.includes('..') || decodedPath.startsWith('/')) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden path'
    })
  }

  const filePath = join(process.cwd(), 'works', decodedPath)

  // Проверяем существование файла
  if (!existsSync(filePath)) {
    throw createError({
      statusCode: 404,
      statusMessage: 'File not found'
    })
  }

  // Проверяем, что это файл, а не папка
  const stats = await stat(filePath)
  if (stats.isDirectory()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Path is a directory, not a file'
    })
  }

  try {
    const fileName = decodedPath.split('/').pop() || 'file'
    
    // Определяем MIME тип по расширению
    const ext = fileName.split('.').pop()?.toLowerCase()
    const mimeTypes: Record<string, string> = {
      'pdf': 'application/pdf',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'xls': 'application/vnd.ms-excel',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'ppt': 'application/vnd.ms-powerpoint',
      'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'txt': 'text/plain',
      'md': 'text/markdown',
      'html': 'text/html',
      'css': 'text/css',
      'js': 'text/javascript',
      'json': 'application/json',
      'xml': 'application/xml',
      'zip': 'application/zip',
      'rar': 'application/x-rar-compressed',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'svg': 'image/svg+xml'
    }

    const mimeType = mimeTypes[ext || ''] || 'application/octet-stream'

    // Правильно экранируем имя файла для заголовка Content-Disposition
    // Удаляем недопустимые символы из имени файла для простого filename
    const safeFileName = fileName
      .replace(/[\r\n"]/g, '') // Удаляем переносы строк и кавычки
      .replace(/[^\x20-\x7E]/g, '_') // Заменяем не-ASCII символы на подчеркивание
    
    // Для filename* используем RFC 5987 encoding
    const encodedFileName = encodeURIComponent(fileName)
    
    setHeader(event, 'Content-Type', mimeType)
    // Используем только filename* для поддержки UTF-8 имен файлов
    setHeader(event, 'Content-Disposition', `attachment; filename="${safeFileName}"; filename*=UTF-8''${encodedFileName}`)
    
    // Используем sendStream для больших файлов или readFile для маленьких
    // Для простоты используем readFile, но можно переключиться на stream для больших файлов
    const fileBuffer = await readFile(filePath)
    setHeader(event, 'Content-Length', fileBuffer.length.toString())
    
    return fileBuffer
  } catch (error) {
    console.error('Error reading file:', error)
    throw createError({
      statusCode: 500,
      statusMessage: `Error reading file: ${error instanceof Error ? error.message : 'Unknown error'}`
    })
  }
})

