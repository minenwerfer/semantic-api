import type { AccessControlLayer } from '../core/accessControl'

export type ValidAccessControlLayer =
  'read'
  | 'write'

export type Role = {
  inherit?: Array<string>
  grantEverything?: boolean
  forbidEverything?: boolean
  capabilities?: Record<string, {
    grantEverything?: boolean
    forbidEverything?: boolean
    functions?: Array<string>
    blacklist?: Array<string>
  }>
}

export type Roles = Record<string, Role>

export type AccessControl = {
  roles?: Roles
  layers?: Partial<Record<ValidAccessControlLayer, AccessControlLayer>>
}

