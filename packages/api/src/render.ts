import ejs from 'ejs'
import type { ResponseToolkit } from '@hapi/hapi'

const normalizeFilename = (path: string) => {
  return `${process.cwd()}/resources/views/${path}.ejs`
}

export const render = async <T extends Record<string, any>>(h: ResponseToolkit, path: string, options?: T) => {
  const filename = normalizeFilename(path)
  const result = await ejs.renderFile(filename, options)

  return h.response(result)
    .header('content-type', 'text/html')
}
