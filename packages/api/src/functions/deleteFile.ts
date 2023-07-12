import type { Description } from '@semantic-api/types'
import type { Context, MongoDocument } from '../types'
import type { UploadAuxProps } from './types'
import { checkImmutability } from '@semantic-api/access-control'
import { createContext } from '../context'

export const deleteFile = <
  TDescription extends Description,
  _TDocument extends MongoDocument
>() => async (payload: UploadAuxProps & { filters: { _id: string } }, context: Context<TDescription, Collections, Algorithms>) => {
  const {
    propertyName,
    parentId,
    ...props

  } = payload

  if( !parentId ) {
    throw new TypeError('no parentId')
  }

  await checkImmutability(
    context, {
      propertyName,
      parentId,
      childId: props.filters._id,
      payload: props
    }
  )

  return context.collections.file.delete(props, await createContext({
    resourceName: 'file',
    parentContext: context
  }))
}
