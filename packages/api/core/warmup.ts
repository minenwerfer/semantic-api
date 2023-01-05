import type { ApiContext } from '../types'
import { getEntityFunction } from './assets'

export default async (context: Pick<ApiContext, 'descriptions' | 'apiConfig'>) => {
  return getEntityFunction('meta@describeAll', 'controllable')(null, context as ApiContext)
}
