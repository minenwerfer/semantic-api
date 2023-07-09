import type { Context } from '@semantic-api/api'
import { meta } from '@semantic-api/system'

if( process.env.MODE !== 'PRODUCTION' ) {
  require('dotenv').config()
}

export const warmup = async (context: Pick<Context<any, any>, 'accessControl' | 'apiConfig'>) => {
  return meta().functions.describeAll({ noSerialize: true }, context as Context<any, any>)
}
