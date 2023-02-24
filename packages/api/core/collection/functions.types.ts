import type { MongoDocument } from '../../types'
import type { default as FileInsert } from '../../../system/resources/collections/file/functions/file@insert'
import type { default as FileDelete } from '../../../system/resources/collections/file/functions/file@delete'

type UploadAuxProps = {
  parentId: string
  propertyName: string
}

export type UploadProps = UploadAuxProps & Parameters<typeof FileInsert>[0]
export type FileDeleteProps = UploadAuxProps & Parameters<typeof FileDelete>[0]

export type Projection<T> = Array<keyof T>|Record<keyof T, number>
type QuerySort<T> = Record<keyof T, 1|-1>

export type CollectionFunctions = {
  insert: <T extends MongoDocument>(payload: {
    what: Partial<T>
    project?: Projection<T>
  }) => Promise<T>

  get: <T extends MongoDocument>(payload: {
    filters?: Partial<T>
    project?: Projection<T>
  }) => Promise<T>

  getAll: <T extends MongoDocument>(payload: {
    filters?: Partial<T>
    offset?: number
    limit?: number
    sort?: QuerySort<T>
    project?: Projection<T>
  }) => Promise<Array<T>>

  delete: <T extends MongoDocument>(payload: {
    filters: Partial<T>
  }) => Promise<T|null>

  deleteAll: <T extends MongoDocument>(payload: {
    filters: Partial<T>
  }) => Promise<unknown>

  modify: <T extends MongoDocument>(payload: {
    filters: Partial<T>
    what: Partial<T>
  }) => Promise<T|null>

  modifyAll: <T extends MongoDocument>(payload: {
    filters: Partial<T>
    what: Partial<T>
  }) => Promise<unknown>

  count: <T extends MongoDocument>(payload: {
    filters?: Partial<T>
  }) => Promise<number>

  upload: (payload: UploadProps) => ReturnType<typeof FileInsert>
  deleteFile: (payload: FileDeleteProps) => ReturnType<typeof FileDelete>
}
