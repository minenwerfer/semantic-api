import type { Collection, Algorithm } from '@semantic-api/api'
import type { AccessControlLayer } from './layers/types'

export type ValidAccessControlLayer =
  'read'
  | 'write'

export type Role<
  TCollections extends Record<string, Collection>,
  TAlgorithms extends Record<string, Algorithm>
> = {
  inherit?: Array<string>
  grantEverything?: boolean
  forbidEverything?: boolean
  capabilities?: {
    [P in keyof (TCollections & TAlgorithms)]?: {
      grantEverything?: boolean
      forbidEverything?: boolean
      functions?: 'functions' extends keyof Awaited<ReturnType<(TCollections & TAlgorithms)[P]>>
        ? Array<keyof Awaited<ReturnType<(TCollections & TAlgorithms)[P]>>['functions']>
        : never
      blacklist?: 'functions' extends keyof Awaited<ReturnType<(TCollections & TAlgorithms)[P]>>
        ? Array<keyof Awaited<ReturnType<(TCollections & TAlgorithms)[P]>>['functions']>
        : never
    }
  }
}

export type Roles<
  TCollections extends Record<string, Collection>,
  TAlgorithms extends Record<string, Algorithm>
> = Record<string, Role<TCollections, TAlgorithms>>

export type AccessControl<
  TCollections extends Record<string, Collection>,
  TAlgorithms extends Record<string, Algorithm>
> = {
  roles?: Roles<TCollections, TAlgorithms>
  layers?: Partial<Record<ValidAccessControlLayer, AccessControlLayer>>
}

