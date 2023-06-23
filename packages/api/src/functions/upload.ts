import type { Context, MongoDocument } from '../types'
import type { UploadProps } from './types'

export const upload = <T extends MongoDocument>(context: Context<T>) => (payload: UploadProps) => {
  return Promise.resolve({})
}
