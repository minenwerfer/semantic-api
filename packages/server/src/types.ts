import type { Request } from '@hapi/hapi'

export type HandlerRequest = Request & {
  payload: any
}

export type ApiConfig = {
  port?: number
  group?: string

  allowSignup?: boolean
  signupDefaults?: {
    roles: Array<string>
    active: boolean
  }

  populateUserExtra?: Array<string>
}
