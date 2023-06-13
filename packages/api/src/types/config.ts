import { Description } from '@semantic-api/types'
import type { User } from '@semantic-api/system/resources/collections/user/user.description'
import type { AccessControl } from '@semantic-api/access-control'
import type { CollectionFunctions } from '../collection/functions.types'
import type { createModel } from '../collection/schema'
import type { FunctionPath } from './function'

export type Collection = {
  description: Description
  model?: ReturnType<typeof createModel>
  library?: Record<string, (...args: any[]) => any>
  functions?: Record<string, (...args: any[]) => any>
  fallbackFunctions?: ReadonlyArray<keyof CollectionFunctions>
}

export type Collections = Record<string, Collection>

export type Config<_Collections extends Collections> = {
  collections: Collections
  accessControl: AccessControl<_Collections>
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
