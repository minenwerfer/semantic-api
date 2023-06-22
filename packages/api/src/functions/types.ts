import type { file } from '@semantic-api/system'
type File = ReturnType<typeof file>

type UploadAuxProps = {
  parentId: string
  propertyName: string
}

export type UploadProps = UploadAuxProps & Parameters<File['functions']['insert']>[0]
export type FileDeleteProps = UploadAuxProps & Parameters<File['functions']['delete']>[0]

export type Filters<T> = Record<`$${string}`, any> & {
  [P in keyof T]?: T[P] | Record<`$${string}`, any>
}

export type Projection<T> = Array<keyof T>|Record<keyof T, number>
export type QuerySort<T> = Record<keyof T, 1|-1>
