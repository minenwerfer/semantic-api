import type { ApiFunction } from '../../../../../api/types'
import { makeException } from '../../../../../api'

const ping: ApiFunction = async (_props, { token, limitRate }) => {
  if( !token.user?.roles?.length ) {
    throw makeException({
      name: 'AuthorizationError',
      message: 'you shall not pass',
      logout: true
    })
  }
}

export default ping
