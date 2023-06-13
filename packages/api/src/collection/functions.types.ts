import type { default as FileInsert } from '@semantic-api/system/resources/collections/file/functions/file@insert'
import type { default as FileDelete } from '@semantic-api/system/resources/collections/file/functions/file@delete'
import type { MongoDocument } from '../types'
import type { Model } from 'mongoose'

type UploadAuxProps = {
  parentId: string
  propertyName: string
}

export type UploadProps = UploadAuxProps & Parameters<typeof FileInsert>[0]
export type FileDeleteProps = UploadAuxProps & Parameters<typeof FileDelete>[0]

export type Filters<T> = Record<`$${string}`, any> & {
  [P in keyof T]?: T[P] | Record<`$${string}`, any>
}

export type Projection<T> = Array<keyof T>|Record<keyof T, number>
export type QuerySort<T> = Record<keyof T, 1|-1>

export type CollectionFunctions = {
  model: <T>() => Model<T>
  insert: <T extends MongoDocument>(payload: {
    what: Partial<T>
    project?: Projection<T>
  }) => Promise<T>

  get: <T extends MongoDocument>(payload: {
   filters?: Filters<T>
    project?: Projection<T>
  }) => Promise<T>

  getAll: <T extends MongoDocument>(payload: {
   filters?: Filters<T>
    offset?: number
    limit?: number
    sort?: QuerySort<T>
    project?: Projection<T>
  }) => Promise<Array<T>>

  delete: <T extends MongoDocument>(payload: {
   filters: Filters<T>
  }) => Promise<T|null>

  deleteAll: <T extends MongoDocument>(payload: {
   filters: Filters<T>
  }) => Promise<unknown>

  modify: <T extends MongoDocument>(payload: {
   filters: Filters<T>
    what: Partial<T>
  }) => Promise<T|null>

  modifyAll: <T extends MongoDocument>(payload: {
   filters: Filters<T>
    what: Partial<T>
  }) => Promise<unknown>

  count: <T extends MongoDocument>(payload: {
    filters?: Filters<T>
  }) => Promise<number>

  upload: (payload: UploadProps) => ReturnType<typeof FileInsert>
  deleteFile: (payload: FileDeleteProps) => ReturnType<typeof FileDelete>
}
