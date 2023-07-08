import type { Description } from '@semantic-api/types'
import type { Context, MongoDocument } from '../types'
import type { Projection } from './types'

export const insert = <
  TDescription extends Description,
  TDocument extends MongoDocument
>(context: Context<TDescription, Collections>) => (payload: {
  what: Partial<TDocument>,
  project?: Projection<TDocument>
}) => {
  return context.model.create(payload.what) as Promise<TDocument>
}
