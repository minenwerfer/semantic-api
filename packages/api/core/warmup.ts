import type { ApiContext } from '../types'
import { getResourceFunction } from './assets'

export default async (context: Pick<ApiContext, 'descriptions' | 'apiConfig'>) => {
  return getResourceFunction('meta@describeAll', 'controllable')(null, context as ApiContext)
}
