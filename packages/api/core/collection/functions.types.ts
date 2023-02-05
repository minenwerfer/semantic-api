import type { default as FileInsert } from '../../../system/resources/collections/file/functions/file@insert'
import type { default as FileDelete } from '../../../system/resources/collections/file/functions/file@delete'

type UploadAuxProps = {
  parentId: string
  propertyName: string
}

export type UploadProps = UploadAuxProps & Parameters<typeof FileInsert>[0]
export type FileDeleteProps = UploadAuxProps & Parameters<typeof FileDelete>[0]

export type GetAllProps<T> = {
  filters?: Partial<T>
  offset?: number
  limit?: number
  sort?: QuerySort<T>
  project?: Projection<T>
}

export type CollectionFunctions<
  T=Record<string, any>,
  P=Props<T>,
  R=ReturnTypes<T>
> = {
  [K in keyof P]: K extends keyof R
    ? (props: P[K]) => R[K]
    : never
}

export type Projection<T> = Array<keyof T>|Record<keyof T, number>

type _ReturnTypes<T> = {
  insert: T
  get: T
  getAll: Array<T>
  delete: T|null
  deleteAll: unknown
  modify: T|null
  modifyAll: unknown
  count: number
  upload: ReturnType<typeof FileInsert>
  deleteFile: ReturnType<typeof FileDelete>
}

type Props<T> = {
  insert: {
    what: Partial<T>
    project?: Projection<T>
  }
  get: {
    filters?: Partial<T>
    project?: Projection<T>
  }
  getAll: GetAllProps<T>
  delete: {
    filters: Partial<T>
  }
  deleteAll: {
    filters: Partial<T>
  }
  modify: {
    filters: Partial<T>
    what: Partial<T>
  }
  modifyAll: {
    filters: Partial<T>
    what: Partial<T>
  }
  count: {
    filters?: Partial<T>
  }
  upload: UploadProps
  deleteFile: FileDeleteProps
}

type ReturnTypes<T> = {
  [P in keyof _ReturnTypes<T>]: Promise<_ReturnTypes<T>[P]>
}

type QuerySort<T> = Record<keyof T, 1|-1>
