import { useAccessControl } from '../core/accessControl/use'
import type { ResponseToolkit } from '@hapi/hapi'
import type { MaybeDescription } from '../../types'
import type { Log } from '../../system/resources/collections/log/log.description'
import type { CollectionFunctions } from '../core/collection/functions.types'
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
  apiConfig: ApiConfig
  accessControl: AccessControl
  injected: Record<string, any>
  token: DecodedToken

  validate: <T>(what: T, required?: Array<keyof T>) => void
  hasRoles: (roles: Array<string>|string) => boolean
  hasCategories: (categories: Array<string>|string) => boolean
  collection: CollectionFunctions

  resource: AnyFunctions
  library: Library
  log: (message: string, details?: Record<string, any>) => Promise<Log>
  collections: Record<string, AnyFunctions>
  controllables: Record<string, AnyFunctions>

  descriptions?: Record<string, MaybeDescription>
  response: ResponseToolkit
}

export type ApiContextWithAC<T=any> = ApiContext<T> & {
  acFunctions: ReturnType<typeof useAccessControl>
}

