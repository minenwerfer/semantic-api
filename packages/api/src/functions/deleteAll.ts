import type { Context, MongoDocument } from '../types'
import type { Filters } from './types'

export const deleteAll = <T extends MongoDocument>(context: Context<T>) => (payload: {
  filters: Filters<T>
}) => {
  const filters = {
    ...payload.filters,
    _id: { $in: payload.filters._id }
  }

  return context.model.deleteMany(filters, {
    strict: 'throw'
  }) as unknown
}
