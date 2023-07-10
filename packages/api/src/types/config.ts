import { Description } from '@semantic-api/types'
import type { AccessControl } from '@semantic-api/access-control'
import type { createModel } from '../collection/schema'
import type { FunctionPath } from './resource'

type User = any

export type CollectionStructure = {
  item: any
  description: Description
  model?: ReturnType<typeof createModel>
  functions?: Record<string, (...args: any[]) => any>
}

export type Collection = () => CollectionStructure|Promise<CollectionStructure>

export type Algorithm = {
  functions?: Record<string, (...args: any[]) => any>
}

export type Config<
  Collections extends Record<string, Collection>,
  Algorithms extends Record<string, Algorithm>
> = {
  collections?: Collections
  algorithms?: Algorithms
  apiConfig?: ApiConfig
  accessControl?: AccessControl<Collections>
}

export type DecodedToken = {
  user: User
  extra?: Record<string, any>
  allowed_functions?: Array<FunctionPath>
  key_id?: string
  key_name?: string
}

export type ApiConfig = {
  port?: number
  modules?: Array<string> // experimental
  group?: string

  allowSignup?: boolean
  signupDefaults?: {
    roles: Array<string>
    active: boolean
  }

  populateUserExtra?: Array<string>
}
