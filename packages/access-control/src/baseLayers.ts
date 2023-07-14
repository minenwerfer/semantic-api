import type { AccessControlLayer } from './layers'
import { writeLayers } from './layers'

export const read: AccessControlLayer<any, any> = async (context, { payload }) => {
  const { token, description } = context

  if( token.user && description.owned ) {
    if( !token.user.roles?.includes('root') || description.alwaysOwned ) {
      payload.filters.owner = token.user._id
    }
  }
}

export const write: AccessControlLayer<any, any> = async (context, { payload }) => {
  const { token, description } = context

  if( token.user && description.owned ) {
    if( !token.user.roles?.includes('root') || description.alwaysOwned ) {
      if( payload.filters ) {
        payload.filters.owner = token.user._id
      }

      payload.what.owner = token.user._id
    }
  }

  const parentId = payload.what?._id || payload.filters?._id
  const mergedPayload = Object.assign(Object.assign({}, payload.what||{}), payload.filters||{})

  for( const layer of writeLayers ) {
    await layer(context, {
      parentId,
      payload: mergedPayload
    })
  }
}
