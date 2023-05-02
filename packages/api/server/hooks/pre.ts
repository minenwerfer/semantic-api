import type { ResponseToolkit } from '@hapi/hapi'
import type { HandlerRequest, DecodedToken, FunctionPath, ApiContext } from '../../types'
import { PAGINATION_PER_PAGE_LIMIT } from '@semantic-api/types'
import { makeException } from '../../core/exceptions'
import { getResourceFunction } from '../../core/assets'
import { isGranted } from '../../core/accessControl/granted'

type PreHookParams = {
  request: HandlerRequest
  token: DecodedToken
  response: ResponseToolkit
  functionPath: FunctionPath
  context: ApiContext
}

export const checkAC = async (params: PreHookParams) => {
  const { context } = params
  if( context.token.key_id ) {
    const key = await getResourceFunction('apiKey@get')({
      filters: {
        _id: context.token.key_id,
        active: true
      }
    }, context)

    if( !key ) {
      throw new (makeException({
        name: 'AuthorizationError',
        message: 'invalid API key',
        httpCode: 403
      }))
    }
  }

  const granted = isGranted(params.functionPath, context)
  
  if( !granted ) {
    throw new (makeException({
      name: 'AuthorizationError',
      message: 'forbidden by access control',
      logout: !context.token.user?.roles,
      httpCode: 403
    }))
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

