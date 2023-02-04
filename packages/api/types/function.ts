import type { Model } from 'mongoose'
import type { useAccessControl } from '../core/accessControl/use'
import type { render } from '../core/render'
import type { limitRate } from '../core/rateLimiting'
import type { Request, ResponseToolkit } from '@hapi/hapi'
import type { Description } from '../../types'
import type { Log } from '../../system/resources/collections/log/log.description'
import type { CollectionFunctions } from '../core/collection/functions.types'
import type { RateLimitingParams } from '../core/rateLimiting'
import type { ApiConfig, DecodedToken } from './server'

export type FunctionPath = `${string}@${string}`

export type ApiFunction<Props=unknown, Library=Record<string, (...args: any) => any>, Return=any> = (
  props: Props,
  context: ApiContext<Library>
) => Return

export type AnyFunctions = CollectionFunctions & Record<string, (props?: any) => any>

export type Role = {
  grantEverything?: boolean
  capabilities?: Record<string, {
    grantEverything?: boolean
    functions?: Array<string>
    blacklist?: Array<string>
  }>
}

export type Roles = Record<string, Role>

export type AccessControl = {
  roles?: Roles
  beforeRead?: (payload: Record<string, any>, context: ApiContext) => Record<string, any>
  beforeWrite?: (payload: Record<string, any>, context: ApiContext) => Record<string, any>
}

export type ApiContext<Library=Record<string, (...args: any[]) => any>> = {
  resourceName: string
  functionPath?: FunctionPath

  apiConfig: ApiConfig
  accessControl: AccessControl
  injected: Record<string, any>
  token: DecodedToken

  validate: <T>(what: T, required?: Array<keyof T>|null, description?: Omit<Description, '$id'>) => void
    limitRate: (params: RateLimitingParams) => ReturnType<typeof limitRate>

  hasRoles: (roles: Array<string>|string) => boolean
  hasCategories: (categories: Array<string>|string) => boolean
  collection: CollectionFunctions
  model: Model<any>

  resource: AnyFunctions
  library: Library
  log: (message: string, details?: Record<string, any>) => Promise<Log>
  controllables: Record<string, AnyFunctions>
  collections: Record<string, AnyFunctions & {
    model: () => Model<any>
  }>

  descriptions: Record<string, Description>
  description: Description
  request: Request & {
    payload: Record<string, any>
  }

  h: ResponseToolkit
  render: <T extends Record<string, any>>(path: string, options?: T) => ReturnType<typeof render>
}

export type ApiContextWithAC<T=any> = ApiContext<T> & {
  acFunctions: ReturnType<typeof useAccessControl>
}

