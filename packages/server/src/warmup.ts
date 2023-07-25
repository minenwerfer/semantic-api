import type { Context } from '@semantic-api/api'
import { meta } from '@semantic-api/system'

if( process.env.MODE !== 'PRODUCTION' ) {
  require('dotenv').config()
}

export const warmup = async (context: Pick<Context<any, any, any>, 'accessControl' | 'apiConfig'>) => {
  return meta().functions.describe({ noSerialize: true }, context as Context<any, any, any>)
}
