import type { Model } from 'mongoose'
import type { Description } from '../../types'
import type { ApiFunction } from './function'

export type AssetType =
  'model'
  | 'description'
  | 'function'


export type EntityType =
  'collection'
  | 'controllable'

export type AssetReturnType<Type> = Type extends 'function'
  ? ApiFunction<any, Promise<any>> : Type extends 'description'
  ? Description : Type extends 'model'
  ? Model<any> : never

