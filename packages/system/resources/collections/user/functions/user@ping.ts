import type { ApiFunction } from '../../../../../api/types'
import { makeException } from '../../../../../api'

const ping: ApiFunction = (_props, { token, rateLimit }) => {
  rateLimit(1)

  if( !token.user?.roles?.length ) {
    throw makeException({
      name: 'AuthorizationError',
      message: 'you shall not pass',
      logout: true
    })
  }
}

export default ping
