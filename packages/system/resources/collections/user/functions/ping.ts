import type { ApiFunction } from '@semantic-api/api'
import { makeException } from '@semantic-api/api'

const ping: ApiFunction = async (_props, { token, limitRate }) => {
  if( !token.user?.roles?.length ) {
    throw new (makeException({
      name: 'AuthorizationError',
      message: 'you shall not pass',
      logout: true
    }))
  }
}

export default ping
