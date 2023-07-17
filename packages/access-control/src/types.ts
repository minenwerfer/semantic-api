import type { CollectionStructure, AlgorithmStructure } from '@semantic-api/api'
import type { AccessControlLayer } from './layers/types'

export type ValidAccessControlLayer =
  'read'
  | 'write'
  | 'call'

export type Role<
  TCollections extends Record<string, CollectionStructure>,
  TAlgorithms extends Record<string, AlgorithmStructure>,
  TAccessControl extends AccessControl<TCollections, TAlgorithms>=any
> = {
  inherit?: Array<keyof TAccessControl['roles']>
  grantEverything?: boolean
  forbidEverything?: boolean
  capabilities?: {
    [P in keyof (TCollections & TAlgorithms)]?: {
      grantEverything?: boolean
      forbidEverything?: boolean
      functions?: 'functions' extends keyof (TCollections & TAlgorithms)[P]
        ? Array<keyof (TCollections & TAlgorithms)[P]['functions']>
        : never
      blacklist?: 'functions' extends keyof (TCollections & TAlgorithms)[P]
        ? Array<keyof (TCollections & TAlgorithms)[P]['functions']>
        : never
    }
  }
}

export type Roles<
  TCollections extends Record<string, CollectionStructure>,
  TAlgorithms extends Record<string, AlgorithmStructure>,
  TAccessControl extends AccessControl<TCollections, TAlgorithms>=any
> = Record<string, Role<TCollections, TAlgorithms, TAccessControl>>

export type AccessControl<
  TCollections extends Record<string, CollectionStructure>,
  TAlgorithms extends Record<string, AlgorithmStructure>,
  TAccessControl extends AccessControl<TCollections, TAlgorithms>=any
> = {
  roles?: Roles<TCollections, TAlgorithms, TAccessControl>
  availableRoles?: keyof TAccessControl['roles']
}

export const defineAccessControl = <
  TCollections extends Record<string, CollectionStructure>,
  TAlgorithms extends Record<string, AlgorithmStructure>,
>() => <const TAccessControl extends AccessControl<TCollections, TAlgorithms, TAccessControl>>(accessControl: TAccessControl) =>
  (layers?: Partial<Record<ValidAccessControlLayer, AccessControlLayer<TCollections, TAlgorithms, TAccessControl>>>) => ({
  ...accessControl,
  layers
})

defineAccessControl<any, any>()({
  roles: {
    guest: {
      inherit: [
        'authenticated'
      ],
      capabilities: {
        checkout: {
          functions: [
            'render'
          ]
        }
      }
    },
    root: {
      grantEverything: true,
    },
  },
})({
    write: async (context, { payload }) => {
      const {
        token,
        resourceName,
        log
      } = context

      if( token.user.roles.includes('oi') ) {
        return
      }

      if( resourceName !== 'log' ) {
        log('user performed insert', payload?.what)
      }
    }
})

