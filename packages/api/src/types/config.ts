import type { Description } from '@semantic-api/types'
import type { AccessControl } from '@semantic-api/access-control'
import type { createModel } from '../collection/schema'
import type { FunctionPath } from './resource'

type User = any

// #region Collection
export type CollectionStructure = {
  item: any
  description: Description
  model?: ReturnType<typeof createModel>
  functions?: Record<string, (...args: any[]) => any>
}

export type Collection = () => CollectionStructure|Promise<CollectionStructure>
// #endregion Collection

// #region Algorithm
export type AlgorithmStructure = {
  functions?: Record<string, (...args: any[]) => any>
}

export type Algorithm = () => AlgorithmStructure|Promise<AlgorithmStructure>
// #endregion Algorithm


export type DecodedToken<TAccessControl extends AccessControl<any, any>=any> = {
  user: Omit<User, 'roles'> & {
    roles: Array<NonNullable<TAccessControl['availableRoles']>>
  }
  extra?: Record<string, any>
  allowed_functions?: Array<FunctionPath>
  key_id?: string
  key_name?: string
}
