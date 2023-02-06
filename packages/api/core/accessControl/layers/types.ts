import type { ApiContext } from '../../..'

export type FinalPayload = Record<string, any>

export type AccessControlLayer = (context: ApiContext, props: {
  propertyName?: string
  parentId?: string
  childId?: string
  payload: Record<string, any>

}) => Promise<FinalPayload>
