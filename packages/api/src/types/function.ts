import type { Model } from 'mongoose'
import type { Request, ResponseToolkit } from '@hapi/hapi'
import type { Log } from '@semantic-api/system'
import type { Description } from '@semantic-api/types'
import type { useAccessControl, AccessControl } from '@semantic-api/access-control'
import type { ApiConfig, DecodedToken } from './config'
import type { render } from '../render'
import type { limitRate } from '../rateLimiting'
import type { RateLimitingParams } from '../rateLimiting'

/**
 * TODO: improve
 */
type CollectionFunctions = any

export type FunctionPath = `${string}@${string}`

export type ApiFunction<Props=unknown, Return=any> = (
  props: Props,
  context: ApiContext
) => Return

export type AnyFunctions = CollectionFunctions & Record<string, (props?: any) => any>

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
  collection: CollectionFunctions
  model: Model<any>

  resource: AnyFunctions
  log: (message: string, details?: Record<string, any>) => Promise<Log>
  algorithms: Record<string, AnyFunctions>
  collections: Record<string, AnyFunctions & {
    model: <T>() => Promise<Model<T>>
  }>

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

