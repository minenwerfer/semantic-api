import { unlink } from 'fs/promises'
import type { ApiContext } from '@semantic-api/api'
import type { File } from './description'

type Props = {
  filters: {
    _id: string
  }
}

const _delete = async (props: Props, { collection }: ApiContext) => {
  const file = await collection.get<File>(props)
  if( !file ) {
    throw new Error('file not found')
  }

  await unlink(file.absolute_path!).catch(() => null)
  return collection.delete(props)
}

export default _delete
