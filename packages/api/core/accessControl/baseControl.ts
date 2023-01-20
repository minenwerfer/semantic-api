import { AccessControl } from '../../types'

export const beforeRead: AccessControl['beforeRead'] = (_payload, { token, description }) => {
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

export const beforeWrite: AccessControl['beforeWrite'] = (payload, { token, description }) => {
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

  return preset
}
