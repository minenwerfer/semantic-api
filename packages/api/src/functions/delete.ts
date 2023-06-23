import type { Model } from 'mongoose'
import type { MongoDocument } from '../types'
import type { Filters } from './types'

export const _delete = <T extends MongoDocument>(model: Model<T>) => (payload: {
  filters: Filters<T>
}) => {
  return model.findOneAndDelete(payload.filters, {
    strict: 'throw'
  })
}
