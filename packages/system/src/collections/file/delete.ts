import { unlink } from 'fs/promises'
import { type Context, useFunctions } from '@semantic-api/api'
import { description, type File } from './description'

type Props = {
  filters: {
    _id: string
  }
}

const _delete = async (props: Props, context: Context<typeof description, any, any>) => {
  const { delete: _delete } = useFunctions<File, typeof description>()
  const file = await context.collection.functions.get(props, context)
  if( !file ) {
    throw new Error('file not found')
  }

  await unlink(file.absolute_path!).catch(() => null)
  return _delete(props, context)
}

export default _delete
