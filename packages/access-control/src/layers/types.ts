import type { Context } from '@semantic-api/api'

export type AccessControlLayer = (context: Context<any, any, any>, props: {
  propertyName?: string
  parentId?: string
  childId?: string
  payload: Record<string, any>

}) => Promise<void>
