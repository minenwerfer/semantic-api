import type { mongoose } from 'mongoose'
import type { Description } from '../types'
import type { Config, Collection, AccessControl } from './types'
import * as SystemCollections from '@semantic-api/system/collections'

declare global {
  var descriptions: Record<string, Description>
  var modules: Record<string, any>
  var mongoose: typeof mongoose

  type UserConfig = Config<Record<string, Collection>>
  type Collections = {
    [K in keyof (UserCollections | typeof SystemCollections)]: Awaited<ReturnType<(UserCollections | typeof SystemCollections)[K]>>
  }

  type UserAccessControl = AccessControl<any>
  type UserACProfile = {
    readonly roles: string[]
    readonly allowed_functions?: string[]
  }
}

