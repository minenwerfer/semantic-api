import { readFile } from 'fs/promises'
import type { ApiContext } from '@semantic-api/api'
import type { File } from './description'

const download = async (_id: string, { collection }: ApiContext) => {
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