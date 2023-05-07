import type { Request } from '@hapi/hapi'
import type { User } from '@semantic-api/system/resources/collections/user/user.description'
import type { FunctionPath } from './function'

export type HandlerRequest = Request & {
  payload: any
}

export type DecodedToken = {
  user: User
  extra?: Record<string, any>
  allowed_functions?: Array<FunctionPath>
  key_id?: string
  key_name?: string
}

export type ApiConfig = {
  port?: number
  modules?: Array<string> // experimental
  group?: string

  allowSignup?: boolean
  signupDefaults?: {
    roles: Array<string>
    active: boolean
  }

  populateUserExtra?: Array<string>
}
