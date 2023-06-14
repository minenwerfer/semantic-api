import type { ApiContext } from '@semantic-api/api'
import { makeException } from '@semantic-api/api'

const ping = async (_props: null, { token }: ApiContext) => {
  if( !token.user?.roles?.length ) {
    throw new (makeException({
      name: 'AuthorizationError',
      message: 'you shall not pass',
      logout: true
    }))
  }
}

export default ping
