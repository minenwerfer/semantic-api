import type { Description } from '../types'
import type { mongoose } from 'mongoose'

import type { Config, AccessControl } from './types'

declare global {
  var descriptions: Record<string, Description>
  var modules: Record<string, any>
  var mongoose: typeof mongoose

  type TesteConfig = Config<any>

  type UserAccessControl = AccessControl<any>
  type UserACProfile = {
    readonly roles: string[]
    readonly allowed_functions?: string[]
  }
}

