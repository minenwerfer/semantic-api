import type { Context, MongoDocument } from '../types'
import type { FileDeleteProps } from './types'

export const deleteFile = <T extends MongoDocument>(context: Context<T>) => (payload: FileDeleteProps) => {
  return Promise.resolve({})
}
