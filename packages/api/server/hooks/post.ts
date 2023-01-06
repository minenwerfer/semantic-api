import type { Request } from '@hapi/hapi'
import type { HandlerRequest, ApiContext, ResourceType } from '../../types'
import { useCollection } from '../../core/collection'

type PostHookParams = {
  redirected?: boolean
  result: any
  request: Request & HandlerRequest
  context: ApiContext
  resourceName: string
  resourceType: ResourceType
}

export const processRedirects = (params: PostHookParams) => {
  const { result } = params
  if( result?.headers?.location ) {
    return {
      redirected: true,
      ...params,
    }
  }

  return params
}

export const appendPagination = async (params: PostHookParams) => {
  const {
    redirected,
    request,
    result,
    context,
    resourceName,
    resourceType
  } = params

  if( redirected ) {
    return result
  }

  const response = {
    result
  }

  if( Array.isArray(result) && resourceType === 'collection' ) {
    const countFunction = useCollection(resourceName, context).count
    const recordsTotal = typeof countFunction === 'function'
      ? await countFunction({ filters: request.payload?.filters || {} })
      : result.length

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

