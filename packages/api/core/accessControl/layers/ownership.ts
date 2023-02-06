import type { AccessControlLayer } from './types'

export const checkOwnership: AccessControlLayer = async (context, { parentId, payload }) => {
  if( (!payload?.owner && !parentId) && context.description.owned ) {
    throw new TypeError(
      'tried to perform insert on an owned resource without specifying owner'
    )
  }
}
