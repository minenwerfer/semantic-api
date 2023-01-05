import type { ApiFunction } from '../../../../api/types'
import FileModel from '../file.model'

const { unlink } = require('fs').promises

type Props = {
  filters: {
    _id: string
  }
}

const _delete: ApiFunction<Props> = async (props, { collection }) => {
  const file = await FileModel.findOne(props.filters)
  if( !file ) {
    throw new Error('file not found')
  }

  await unlink(file.absolute_path).catch(() => null)
  return collection.delete(props)
}

export default _delete
