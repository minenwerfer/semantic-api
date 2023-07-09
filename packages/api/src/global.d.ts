import type { mongoose } from 'mongoose'
import type { Description } from '../types'
import type { Config, Collection, Algorithm, AccessControl } from './types'
import * as SystemCollections from '@semantic-api/system/collections'
import * as SystemAlgorithms from '@semantic-api/system/algorithms'

declare global {
  var descriptions: Record<string, Description>
  var modules: Record<string, any>
  var mongoose: typeof mongoose

  type UserCollections = Record<string, any>
  type UserAlgorithms = Record<string, any>
  type UserConfig = Config<
    UserCollections & typeof SystemCollections,
    UserAlgorithms & typeof UserAlgorithms
  >

  type UnpackFunctions<T> = {
    [K in keyof (T)]: Awaited<ReturnType<(T)[K]>>
  }

  type Collections = UnpackFunctions<UserCollections | typeof SystemCollections>
  type Algorithms = UnpackFunctions<UserAlgorithms | typeof SystemAlgorithms>


  type UserAccessControl = AccessControl<any>
  type UserACProfile = {
    readonly roles: string[]
    readonly allowed_functions?: string[]
  }
}

