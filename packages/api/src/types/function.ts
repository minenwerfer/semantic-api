import type { Model } from 'mongoose'
import type { Request, ResponseToolkit } from '@hapi/hapi'
import type { Log } from '@semantic-api/system'
import type { Description } from '@semantic-api/types'
import type { useAccessControl, AccessControl } from '@semantic-api/access-control'
import type { render } from '../render'
import type { limitRate } from '../rateLimiting'
import type { RateLimitingParams } from '../rateLimiting'
import type { Algorithm, Collection, ApiConfig, DecodedToken } from './config'

export type FunctionPath = `${string}@${string}`

export type ApiFunction<Props=unknown, Return=any> = (
  props: Props,
  context: ApiContext
) => Return

export type ApiContext = {
  resourceName: string
  functionPath?: FunctionPath

  apiConfig: ApiConfig
  accessControl: AccessControl<any>
  injected: Record<string, any>
  token: DecodedToken

  validate: <T>(what: T, required?: Array<keyof T>|null, description?: Omit<Description, '$id'>) => void
  limitRate: (params: RateLimitingParams) => ReturnType<typeof limitRate>

  hasRoles: (roles: Array<string>|string) => boolean
  hasCategories: (categories: Array<string>|string) => boolean
  collection: Collection
  model: Model<any>

  log: (message: string, details?: Record<string, any>) => Promise<Log>
  algorithms: Record<string, Algorithm>
  collections: Record<string, Collection>
  descriptions: Record<string, Description>
  description: Description
  request: Request & {
    payload: Record<string, any>
  }

  h: ResponseToolkit
  render: <T extends Record<string, any>>(path: string, options?: T) => ReturnType<typeof render>
}

export type ApiContextWithAC = ApiContext & {
  acFunctions: ReturnType<typeof useAccessControl>
}

