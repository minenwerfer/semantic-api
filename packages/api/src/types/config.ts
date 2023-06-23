import { Description } from '@semantic-api/types'
import type { User } from '@semantic-api/system'
import type { AccessControl } from '@semantic-api/access-control'
import type { createModel } from '../collection/schema'
import type { FunctionPath } from './function'
import * as CollectionFunctions  from '../functions'

export type Collection = () => {
  description: Description
  model?: ReturnType<typeof createModel>
  functions?: Record<string, (...args: any[]) => any>
}

export type Algorithm = {
  functions?: Record<string, (...args: any[]) => any>
}

export type Config<Collections extends Record<string, Collection>> = {
  collections: Collections
  accessControl: AccessControl<Collections>
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
