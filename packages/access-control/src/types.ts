import type { Collection } from '@semantic-api/api'
import type { AccessControlLayer } from './layers/types'

export type ValidAccessControlLayer =
  'read'
  | 'write'

export type Role<TCollections extends Record<string, Collection>> = {
  inherit?: Array<string>
  grantEverything?: boolean
  forbidEverything?: boolean
  capabilities?: {
    [P in keyof TCollections]?: {
      grantEverything?: boolean
      forbidEverything?: boolean
      functions?: 'functions' extends keyof TCollections[P]
        ? Array<keyof TCollections[P]['functions']>
        : never
      blacklist?: 'functions' extends keyof TCollections[P]
        ? Array<keyof TCollections[P]['functions']>
        : never
    }
  }
}

export type Roles<TCollections extends Record<string, Collection>> = Record<string, Role<TCollections>>

export type AccessControl<TCollections extends Record<string, Collection>> = {
  roles?: Roles<TCollections>
  layers?: Partial<Record<ValidAccessControlLayer, AccessControlLayer>>
}

