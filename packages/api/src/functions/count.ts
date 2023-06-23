import type { Context, MongoDocument } from '../types'
import type { Filters } from './types'

export const count = <T extends MongoDocument>(context: Context<T>) => async (payload: { filters?: Filters<T> }) => {
  return context.model.countDocuments(payload.filters)
}
