import type { Request } from '@hapi/hapi'
import type { HandlerRequest, ApiContext, EntityType } from '../../types'
import { useCollection } from '../../core/collection'

type PostHookParams = {
  redirected?: boolean
  result: any
  request: Request & HandlerRequest
  context: ApiContext
  entityName: string
  entityType: EntityType
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
    entityName,
    entityType
  } = params

  if( redirected ) {
    return result
  }

  const response = {
    result
  }

  if( Array.isArray(result) && entityType === 'collection' ) {
    const countFunction = useCollection(entityName, context).count
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

