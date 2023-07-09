import type { Context } from '@semantic-api/api'
import { makeException } from '@semantic-api/api'

const ping = async (_props: null, { token }: Context<any, any, any>) => {
  if( !token.user?.roles?.length ) {
    throw makeException({
      name: 'AuthorizationError',
      message: 'you shall not pass',
      logout: true
    })
  }
}

export default ping
