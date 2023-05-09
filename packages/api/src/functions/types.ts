import type { default as FileInsert } from '@semantic-api/system/resources/collections/file/functions/file@insert'
import type { default as FileDelete } from '@semantic-api/system/resources/collections/file/functions/file@delete'

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
