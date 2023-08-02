import type { Context } from '@semantic-api/api'
import { left } from '@semantic-api/common'

const ping = async (_props: null, { token }: Context) => {
  if( !token.user?.roles?.length ) {
    return left('AUTHORIZATION_ERROR')
  }
}

export default ping
