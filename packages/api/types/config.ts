import { Description } from '@semantic-api/types'
import type { AccessControl } from './accessControl'
import type { CollectionFunctions } from '../core/collection/functions.types'
import type { createModel } from '../core/collection/schema'

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
