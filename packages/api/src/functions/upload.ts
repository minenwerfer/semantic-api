import type { Description } from '@semantic-api/types'
import type { Context, MongoDocument } from '../types'
import type { UploadProps } from './types'

export const upload = <
  TDescription extends Description,
  TDocument extends MongoDocument
>() => (payload: UploadProps, context: Context<TDescription, Collections>) => {
  return Promise.resolve({})
}
