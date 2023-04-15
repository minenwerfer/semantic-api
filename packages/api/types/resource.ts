import type { Model } from 'mongoose'
import type { Description } from '../../types'
import type { ApiFunction } from './function'

export const RESOURCE_TYPES = <const>{
  collection: 'collections',
  algorithm: 'algorithms'
}

export const ASSET_TYPES = <const>{
  description: 'description',
  model: 'model',
  library: 'library',
  function: 'functions'
}

export type ResourceType = keyof typeof RESOURCE_TYPES
export type AssetType = keyof typeof ASSET_TYPES

type _Resource = {
  functions: Record<string, ApiFunction<any>>
  library?: Record<string, (...args: any[]) => any>
}

export type CollectionResource = _Resource & {
  description?: Description
  model?: Model<any>
  library?: Record<string, (...args: any[]) => any>
}

export type AlgorithmResource = _Resource & {
}

export type Resource = CollectionResource | AlgorithmResource
export type Collections = Record<string, CollectionResource>
export type Algorithms = Record<string, AlgorithmResource>

export type Resources = {
  collections?: Collections
  algorithms?: Algorithms
}
