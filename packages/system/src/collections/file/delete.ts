import { unlink } from 'fs/promises'
import type { Context } from '@semantic-api/api'
import description, { type File } from './description'

type Props = {
  filters: {
    _id: string
  }
}

const _delete = async (props: Props, { collection }: Context<typeof description, any, any>) => {
  const file = await collection.get(props)
  if( !file ) {
    throw new Error('file not found')
  }

  await unlink(file.absolute_path!).catch(() => null)
  return collection.delete(props)
}

export default _delete
