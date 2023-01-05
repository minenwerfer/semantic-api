export type GetAllProps<T> = {
  filters?: Partial<T>
  offset?: number
  limit?: number
  sort?: QuerySort<T>
  project?: Project<T>
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

type Project<T> = Array<keyof T>|Record<keyof T, number>

type _ReturnTypes<T> = {
  insert: T
  get: T
  getAll: Array<T>
  delete: T|null
  deleteAll: unknown
  modify: T|null
  modifyAll: unknown
  count: number
}

type Props<T> = {
  insert: {
    what: Partial<T>
  }
  get: {
    filters?: Partial<T>
    project?: Project<T>
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
}

type ReturnTypes<T> = {
  [P in keyof _ReturnTypes<T>]: Promise<_ReturnTypes<T>[P]>
}

type QuerySort<T> = Record<keyof T, 1|-1>
