import type { MongoDocument } from '../types'
import type { UploadProps } from './types'

export const upload = <T>() => (payload: UploadProps) => {
  return Promise.resolve({})
}
