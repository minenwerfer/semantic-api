import { readFile } from 'fs/promises'
import type { ApiFunction } from '@semantic-api/api'
import type { File } from '../file.description'

const download: ApiFunction<string> = async (_id, { collection }): Promise<Omit<File, 'content'> & { content: Buffer }> => {
  const file = await collection.get({
    filters: {
      _id
    }
  }) as File

  if( !file ) {
    throw new Error('file not found')
  }

  const content = await readFile(file.absolute_path!) as unknown

  return {
    ...file,
    content: Buffer.from(content as string, 'base64')
  }
}

export default download
