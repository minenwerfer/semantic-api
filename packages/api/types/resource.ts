import type { Model } from 'mongoose'
import type { Description } from '../../types'
import type { ApiFunction } from './function'

export type AssetType =
  'model'
  | 'description'
  | 'function'
  | 'library'


export type ResourceType =
  'collection'
  | 'algorithm'

export type AssetReturnType<Type extends AssetType> = Type extends 'function'
  ? ApiFunction<any> : Type extends 'description'
  ? Description : Type extends 'model'
  ? Model<any> : Type extends 'library'
  ? Record<string, (...args: any[]) => any> : never

