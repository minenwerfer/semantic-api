import type { Collections } from '@semantic-api/api'
import type { AccessControlLayer } from './layers/types'

export type ValidAccessControlLayer =
  'read'
  | 'write'

export type Role<_Collections extends Collections> = {
  inherit?: Array<string>
  grantEverything?: boolean
  forbidEverything?: boolean
  capabilities: {
    [P in keyof _Collections]?: {
      grantEverything?: boolean
      forbidEverything?: boolean
      functions?: _Collections[P]['fallbackFunctions'] extends readonly string[]
        ? Array<keyof _Collections[P]['functions'] | _Collections[P]['fallbackFunctions'][number]>
        : Array<keyof _Collections[P]['functions']>
      blacklist?: _Collections[P]['fallbackFunctions'] extends readonly string[]
        ? Array<keyof _Collections[P]['functions'] | _Collections[P]['fallbackFunctions'][number]>
        : Array<keyof _Collections[P]['functions']>
    }
  }
}

export type Roles<_Collections extends Collections> = Record<string, Role<_Collections>>

export type AccessControl<_Collections extends Collections> = {
  roles?: Roles<_Collections>
  layers?: Partial<Record<ValidAccessControlLayer, AccessControlLayer>>
}

