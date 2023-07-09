import type { Description } from '@semantic-api/types'
import type { Context, MongoDocument } from '../types'
import type { FileDeleteProps } from './types'

export const deleteFile = <
  TDescription extends Description,
  _TDocument extends MongoDocument
>() => (payload: FileDeleteProps, context: Context<TDescription, Collections, Algorithms>) => {
  return Promise.resolve({})
}
