import type { ApiContext } from '../../..'

export type AccessControlLayer = (context: ApiContext, props: {
  propertyName?: string
  parentId?: string
  childId?: string
  payload?: Record<string, any>

}) => Promise<void>
