import type { ApiFunction } from '../../../../../api/types'
import { makeException } from '../../../../../api'

const ping: ApiFunction = async (_props, { token, limitRate }) => {
  await limitRate({
    limit: 10,
    scale: 5
  })

  if( !token.user?.roles?.length ) {
    throw makeException({
      name: 'AuthorizationError',
      message: 'you shall not pass',
      logout: true
    })
  }
}

export default ping
