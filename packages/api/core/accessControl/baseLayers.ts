import type { AccessControlLayer } from './layers'
import accessControlLayers from './layers'

export const read: AccessControlLayer = async (context) => {
  const { token, description } = context
  const preset: any = {
    filters: {}
  }

  if( token.user ) {
    if( !token.user.roles?.includes('root') || description.alwaysOwned ) {
      preset.filters.owner = token.user._id
    }
  }

  return preset
}

export const write: AccessControlLayer = async (context, { payload }) => {
  const { token, description } = context
  const preset: any = {
    what: {}
  }

  if( token.user ) {
    if( !token.user.roles?.includes('root') || description.alwaysOwned ) {
      if( payload.filters ) {
        payload.filters.owner = token.user._id
      }

      preset.what.owner = token.user._id
    }
  }

  const parentId = payload.what?._id || payload.filters?._id
  const mergedPayload = Object.assign(Object.assign({}, payload.what||{}), payload.filters||{})

  for( const layer of accessControlLayers ) {
    await layer(context, {
      parentId,
      payload: mergedPayload
    })
  }

  return preset
}
