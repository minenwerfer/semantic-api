export type CustomException = {
  name: string
  code?: string
  message?: string
  details?: Record<string, any>
  silent?: boolean
  logout?: boolean
  httpCode?: number
}

export const makeException = (custom: CustomException) => {
  class Impl extends Error {
    name = custom.name
    code = custom.code
    details = custom.details
    silent = custom.silent
    logout = custom.logout
    httpCode = custom.httpCode

    constructor() {
      super(custom.message)
    }
  }

  return new Impl()
}
