import type { ApiContext } from '@semantic-api/api'
import { meta } from '@semantic-api/system'

if( process.env.MODE !== 'PRODUCTION' ) {
  require('dotenv').config()
}

export const warmup = async (context: Pick<ApiContext, 'descriptions' | 'apiConfig'>) => {
  return meta.functions.describeAll({ noSerialize: true }, context as ApiContext)
}
