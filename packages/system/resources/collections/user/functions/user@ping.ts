import type { ApiFunction } from '../../../../../api/types'
import { makeException } from '../../../../../api'

const ping: ApiFunction = (_props, { token }) => {
  if( !token.user?._id ) {
    throw makeException({
      name: 'AuthorizationError',
      message: 'you shall not pass',
      logout: true
    })
  }
}

export default ping
