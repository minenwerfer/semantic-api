import type { ResponseToolkit } from '@hapi/hapi'
import type { HandlerRequest, DecodedToken, FunctionPath, ApiContext } from '../../types'
import { PAGINATION_PER_PAGE_LIMIT } from '../../../types/constants'
import { makeException } from '../../core/exceptions'
import { isGranted } from '../../core/access/granted'

type PreHookParams = {
  request: HandlerRequest
  token: DecodedToken
  response: ResponseToolkit
  functionPath: FunctionPath
  context: ApiContext
}

export const checkAC = (params: PreHookParams) => {
  const granted = isGranted(
    params.functionPath,
    params.token,
    params.context
  )
  
  if( !granted ) {
    throw makeException({
      name: 'AuthorizationError',
      message: 'forbidden by access control'
    })
  }

  return params
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

