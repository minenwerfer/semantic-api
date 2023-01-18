import type { ApiFunction } from '../../../../../api/types'
import type { File } from '../file.description'

const { readFile } = require('fs').promises

const download: ApiFunction<string> = async (_id, { collection }): Promise<Omit<File, 'content'> & { content: Buffer }> => {
  const file = await collection.get({
    filters: {
      _id
    }
  }) as File

  if( !file ) {
    throw new Error('file not found')
  }

  const content = await readFile(file.absolute_path)

  return {
    ...file,
    content: Buffer.from(content, 'base64')
  }
}

export default download
