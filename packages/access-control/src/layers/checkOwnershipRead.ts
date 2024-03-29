import type { AccessControlLayerProps, ReadPayload } from './types'
import type { Context } from '@semantic-api/api'
import { right } from '@semantic-api/common'

export const checkOwnershipRead = async (context: Context, props: AccessControlLayerProps<ReadPayload>) => {
  const { token, description } = context
  const payload = Object.assign({}, props.payload)

  if( token.user && description.owned ) {
    if( !token.user.roles?.includes('root') || description.owned === 'always' ) {
      payload.filters.owner = token.user._id
    }
  }

  return right(payload)
}
