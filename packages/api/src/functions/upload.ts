import type { Description } from '@semantic-api/types'
import type { Context, MongoDocument } from '../types'
import type { UploadProps } from './types'

export const upload = <
  TDescription extends Description,
  TDocument extends MongoDocument
>(context: Context<TDescription, Collections>) => (payload: UploadProps) => {
  return Promise.resolve({})
}
