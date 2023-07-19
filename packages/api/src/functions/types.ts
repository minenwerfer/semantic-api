export type UploadAuxProps = {
  parentId: string
  propertyName: string
}

export type Filters<T> = Record<`$${string}`, any> & {
  [P in keyof T]?: T[P] | Record<`$${string}`, any> | string
}

export type What<T> = {
  [P in keyof T]?: T[P] | string
}

export type Projection<T> = Array<keyof T>|Record<keyof T, number>
export type QuerySort<T> = Record<keyof T, 1|-1>
