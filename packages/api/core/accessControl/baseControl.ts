import { AccessControl } from '../../types'
import { checkImmutability, checkOwnership } from './layers'

export const beforeRead: AccessControl['beforeRead'] = async (_payload, context) => {
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

export const beforeWrite: AccessControl['beforeWrite'] = async (payload, context) => {
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

  const props = new Set([
    ...Object.keys(payload.what||{}),
    ...Object.keys(payload.filters||{})
  ])

  const parentId = payload.what?._id || payload.filters?._id
  const mergedPayload = Object.assign(Object.assign({}, payload.what||{}), payload.filters||{})

  await checkOwnership(context, {
    parentId,
    payload: mergedPayload
  })

  if( parentId ) {
    props.forEach(async (propertyName) => {
      await checkImmutability(context, {
        propertyName,
        parentId
      })
    })
  }

  return preset
}
