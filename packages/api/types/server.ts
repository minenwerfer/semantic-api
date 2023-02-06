import type { Request } from '@hapi/hapi'
import type { User } from '../../system/resources/collections/user/user.description'

export type HandlerRequest = Request & {
  payload: any
}

export type DecodedToken = {
  user: User
  extra?: Record<string, any>
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
  dynamicCollections?: boolean
}
