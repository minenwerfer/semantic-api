import type { Request } from '@hapi/hapi'
import type { Context, ResourceType } from '@semantic-api/api'
import type { HandlerRequest, } from '../types'
import { getResourceAsset, unsafe } from '@semantic-api/api'

type PostHookParams = {
  redirected?: boolean
  result: any
  request: Request & HandlerRequest
  context: Context<any, any, any>
  resourceName: string
  resourceType: ResourceType
}

export const appendPagination = async (params: PostHookParams) => {
  const {
    request,
    result,
    resourceName,
    resourceType
  } = params

  if( result?.constructor?.name === 'Response' ) {
    return result
  }

  const response = result?._tag
    ? result
    : { result }

  if( Array.isArray(result) && resourceType === 'collection' ) {
    const model = unsafe(await getResourceAsset(resourceName, 'model'))
     const recordsTotal = await model.countDocuments(request.payload?.filters || {})

    const limit = request.payload?.limit
      ? +request.payload.limit
      : +(process.env.PAGINATION_LIMIT || 35)

    Object.assign(response, {
      pagination: {
        recordsCount: result.length,
        recordsTotal,
        offset: request.payload?.offset || 0,
        limit
      }
    })
  }

  return response
}

