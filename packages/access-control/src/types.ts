import type { Collection, Algorithm } from '@semantic-api/api'
import type { AccessControlLayer } from './layers/types'

export type ValidAccessControlLayer =
  'read'
  | 'write'

export type Role<
  TCollections extends Record<string, Awaited<ReturnType<Collection>>>,
  TAlgorithms extends Record<string, Awaited<ReturnType<Algorithm>>>
> = {
  inherit?: Array<string>
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
  TCollections extends Record<string, Awaited<ReturnType<Collection>>>,
  TAlgorithms extends Record<string, Awaited<ReturnType<Algorithm>>>
> = Record<string, Role<TCollections, TAlgorithms>>

export type AccessControl<
  TCollections extends Record<string, Awaited<ReturnType<Collection>>>,
  TAlgorithms extends Record<string, Awaited<ReturnType<Algorithm>>>
> = {
  roles?: Roles<TCollections, TAlgorithms>
  layers?: Partial<Record<ValidAccessControlLayer, AccessControlLayer<TCollections, TAlgorithms>>>
}

