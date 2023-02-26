import type { ApiContext } from '../types'
import { getResourceFunction } from './assets'

export default async (context: Pick<ApiContext, 'descriptions' | 'apiConfig'>) => {
  if( process.env.MODE !== 'PRODUCTION' ) {
    require('dotenv').config()
  }

  return getResourceFunction('meta@describeAll', 'algorithm')({ noSerialize: true }, context as ApiContext)
}
