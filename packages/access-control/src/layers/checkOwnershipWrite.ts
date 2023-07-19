import type { AccessControlLayerProps, WritePayload } from './types'
import type { Context } from '@semantic-api/api'
import { left, right } from '@semantic-api/common'
import { ACErrors } from '../errors'

export const checkOwnershipWrite = async (context: Context<any, any, any>, props: AccessControlLayerProps<WritePayload>) => {
  const { token, description } = context
  const { parentId } = props

  const payload = Object.assign({}, props.payload)

  if( token.user && description.owned ) {
    if( !token.user.roles?.includes('root') || description.alwaysOwned ) {
      payload.what.owner = token.user._id
    }
  }

  if( (!payload.what.owner && !parentId) && context.description.owned ) {
    return left(ACErrors.OwnershipError)
  }

  return right(payload)
}
