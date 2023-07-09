// import { existsSync } from 'fs'
// import type { Model } from 'mongoose'
import type {
  ResourceType,
  AssetType,
  FunctionPath,

} from './types'

import { arraysIntersects, left, right, isLeft, unwrapEither, Right } from '@semantic-api/common'
// import SystemCollections from '@semantic-api/system/resources/collections/index.js'
// import SystemAlgorithms from '@semantic-api/system/resources/algorithms/index.js'
// import type { DecodedToken } from '../types/server'
//
import { isGranted, ACErrors } from '@semantic-api/access-control'
import { validateFromDescription, ValidateFunction } from './collection/validate'
import { limitRate } from './rateLimiting'

const __cachedResources: Awaited<ReturnType<typeof internalGetResources>> & {
  _cached: boolean
} = {
  _cached: false
}

export enum ResourceErrors {
  ResourceNotFound = 'RESOURCE_NOT_FOUND',
  AssetNotFound = 'AssetNotFound'
}

export const requireWrapper = (path: string) => {
  const content = require(path)
  return content.default || content
}

export const internalGetResources = async () => {
  const { collections, algorithms } = await import('@semantic-api/system')
  const userConfig = await import(process.cwd() + '/index.js')
  const resources: typeof userConfig = {
    collections: {},
    algorithms: {}
  }

  Object.assign(resources, userConfig)
  Object.assign(resources.collections, collections)
  Object.assign(resources.algorithms, algorithms)

  return resources
}

export const getResources = async () => {
  if( __cachedResources._cached ) {
    return __cachedResources
  }

  const resources = await internalGetResources()
  Object.assign(__cachedResources, {
    ...resources,
    _cached: true
  })

  return resources
}

export const getResourceAsset = async <
  ResourceName extends keyof Collections,
  AssetName extends keyof Collections[ResourceName] & AssetType,
  TResourceType extends `${ResourceType}s`
>(
  resourceName: ResourceName,
  assetName: AssetName,
  _resourceType?: TResourceType
) => {
  const resources = await getResources()
  const resourceType = _resourceType || 'collections'

  if( !(resourceName in resources[resourceType]) ) return left(ResourceErrors.ResourceNotFound)
  if( !(assetName in resources[resourceType][resourceName]()) ) return left(ResourceErrors.AssetNotFound)

  const asset = (await resources[resourceType][resourceName]())[assetName] as Collections[ResourceName][AssetName]

  const result = right(asset)
  return result as Exclude<typeof result, Right<never>>
}

export const get = getResourceAsset

export const getFunction = async <
  ResourceName extends keyof Collections,
  FunctionName extends keyof Collections[ResourceName]['functions'],
  TResourceType extends `${ResourceType}s` & keyof UserConfig,
  ReturnedFunction=ResourceName extends keyof UserConfig[TResourceType]
      ? FunctionName extends keyof Collections[ResourceName][TResourceType]
        ? Collections[ResourceName]['functions'][FunctionName]
        : never
        : never
>(
  resourceName: ResourceName,
  functionName: FunctionName,
  acProfile?: UserACProfile,
  resourceType?: TResourceType
) => {
  if( acProfile ) {
    if( !await isGranted(resourceName, String(functionName), acProfile) ) {
      return left(ACErrors.AuthorizationError)
    }
  }
  const functionsEither = await getResourceAsset(resourceName, 'functions', resourceType || 'collections')
  if( isLeft(functionsEither) ) {
    const error = unwrapEither(functionsEither)
    return left(error)
  }

  const functions = unwrapEither(functionsEither) 
  return right(functions![functionName] as ReturnedFunction)
}
