import type { Description } from '@semantic-api/types'
import type { Context, MongoDocument } from '../types'
import type { Filters } from './types'

export const deleteAll = <
  TDescription extends Description,
  TDocument extends MongoDocument
>(context: Context<TDescription, Collections>) => (payload: {
  filters: Filters<TDocument>
}) => {
  const filters = {
    ...payload.filters,
    _id: { $in: payload.filters._id }
  }

  return context.model.deleteMany(filters, {
    strict: 'throw'
  }) as unknown
}
