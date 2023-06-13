import type { ApiContext } from '@semantic-api/api'

export type AccessControlLayer = (context: ApiContext, props: {
  propertyName?: string
  parentId?: string
  childId?: string
  payload: Record<string, any>

}) => Promise<void>
