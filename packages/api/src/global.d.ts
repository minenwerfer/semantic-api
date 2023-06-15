import type { mongoose } from 'mongoose'
import type { Description } from '../types'
import type { Config, AccessControl } from './types'
import * as SystemCollections from '@semantic-api/system'

declare global {
  var descriptions: Record<string, Description>
  var modules: Record<string, any>
  var mongoose: typeof mongoose

  type UserConfig = Config<any>
  type Collections = UserConfig['collections'] & typeof SystemCollections

  type UserAccessControl = AccessControl<any>
  type UserACProfile = {
    readonly roles: string[]
    readonly allowed_functions?: string[]
  }
}

