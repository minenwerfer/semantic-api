import type { FileDeleteProps } from './types'

export const deleteFile = <T>() => (payload: FileDeleteProps) => {
  return Promise.resolve({})
}
