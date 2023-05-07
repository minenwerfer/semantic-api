import type { ResponseToolkit } from '@hapi/hapi'
import type { HandlerRequest, DecodedToken, FunctionPath, ApiContext } from '../../types'
import { PAGINATION_PER_PAGE_LIMIT } from '@semantic-api/types'

type PreHookParams = {
  request: HandlerRequest
  token: DecodedToken
  response: ResponseToolkit
  functionPath: FunctionPath
  context: ApiContext
}

export const sanitizeRequest = (params: PreHookParams) => {
  const { request } = params
  if( ['POST', 'PUT'].includes(request.method) ) {
    if( !request.payload ) {
      throw new Error('request payload absent')
    }
  }

  return params
}

export const prependPagination = (params: PreHookParams) => {
  const { request } = params
  if(
    typeof request.payload?.limit === 'number'
    && request.payload.limit > PAGINATION_PER_PAGE_LIMIT
  ) {
    request.payload.limit = PAGINATION_PER_PAGE_LIMIT
  }

  return params
}

