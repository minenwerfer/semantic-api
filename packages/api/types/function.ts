import type { Model } from 'mongoose'
import type { Request, ResponseToolkit } from '@hapi/hapi'
import type { Log } from '@semantic-api/system/resources/collections/log/log.description'
import type { useAccessControl } from '../core/accessControl/use'
import type { render } from '../core/render'
import type { limitRate } from '../core/rateLimiting'
import type { Description } from '../../types'
import type { CollectionFunctions } from '../core/collection/functions.types'
import type { RateLimitingParams } from '../core/rateLimiting'
import type { ApiConfig, DecodedToken } from './server'
import type { AccessControl } from './accessControl'

export type FunctionPath = `${string}@${string}`

export type ApiFunction<Props=unknown, Library=Record<string, (...args: any) => any>, Return=any> = (
  props: Props,
  context: ApiContext<Library>
) => Return

export type AnyFunctions = CollectionFunctions & Record<string, (props?: any) => any>

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
  model: <T>() => Promise<Model<T>>

  resource: AnyFunctions
  library: Library
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

export type ApiContextWithAC<T=any> = ApiContext<T> & {
  acFunctions: ReturnType<typeof useAccessControl>
}

