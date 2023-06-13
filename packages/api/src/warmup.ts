import type { ApiContext } from './types'
import { getResourceFunction } from './assets'

if( process.env.MODE !== 'PRODUCTION' ) {
  require('dotenv').config()
}

export const warmup = async (context: Pick<ApiContext, 'descriptions' | 'apiConfig'>) => {
  return getResourceFunction('meta@describeAll', 'algorithm')({ noSerialize: true }, context as ApiContext)
}
