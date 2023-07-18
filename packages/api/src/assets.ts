import type { ResourceType, AssetType, Context } from './types'
import { unsafe, left, right, isLeft, unwrapEither, Right } from '@semantic-api/common'
import { isGranted, ACErrors, type AccessControl } from '@semantic-api/access-control'

const __cachedResources: Awaited<ReturnType<typeof internalGetResources>> & {
  _cached: boolean
} = {
  _cached: false,
  collections: {},
  algorithms: {}
}

export enum ResourceErrors {
  ResourceNotFound = 'RESOURCE_NOT_FOUND',
  AssetNotFound = 'ASSET_NOT_FOUND',
  FunctionNotFound = 'FUNCTION_NOT_FOUND'
}

export const requireWrapper = (path: string) => {
  const content = require(path)
  return content.default || content
}

const internalGetResources = async () => {
  // @ts-ignore
  const { collections, algorithms } = await import('@semantic-api/system')
  const userConfig = await import(process.cwd() + '/index.js')
  const resources = {
    collections,
    algorithms
  }

  Object.assign(resources.collections, userConfig.collections)
  Object.assign(resources.algorithms, userConfig.algorithms)

  return resources
}

export const getAccessControl = async () => {
  const userConfig = await import(process.cwd() + '/index.js')
  return userConfig.accessControl as AccessControl<Collections, Algorithms>
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
  AssetName extends (keyof Collections[ResourceName] & AssetType) | 'model',
  TResourceType extends `${ResourceType}s`
>(
  resourceName: ResourceName,
  assetName: AssetName,
  _resourceType?: TResourceType
) => {
  const resources = await getResources()
  const resourceType = _resourceType || 'collections'

  const asset = (await resources[resourceType][resourceName]?.())?.[assetName] as Collections[ResourceName][AssetName]

  const result = right(await (async () => {
    switch( assetName ) {
      case 'model': {
        if( !asset ) {
          const description = unsafe(await getResourceAsset(resourceName, 'description')) as any
          const { createModel } = await import('./collection/schema')
          return createModel(description)
        }

        return typeof asset === 'function'
          ? asset()
          : asset
      }

      default:
        return asset
    }
  })())

  if( !result.value ) {
    if( !(resourceName in resources[resourceType]) ) return left(ResourceErrors.ResourceNotFound)
    if( !(assetName in resources[resourceType][resourceName]()) ) return left(ResourceErrors.AssetNotFound)
  }

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
    if( !await isGranted(String(resourceName), String(functionName), acProfile as any) ) {
      return left(ACErrors.AuthorizationError)
    }
  }

  const functionsEither = await getResourceAsset(resourceName, 'functions', resourceType || 'collections')
  if( isLeft(functionsEither) ) {
    const error = unwrapEither(functionsEither)
    return left(error)
  }

  const functions = unwrapEither(functionsEither) 
  if( !(functionName in functions) ) {
    return left(ResourceErrors.FunctionNotFound)
  }

  const accessControl = await getAccessControl()
  if( accessControl.layers?.call ) {
    const fn = async (payload: any, context: Context<any, Collections, Algorithms>) => {
      await accessControl.layers!.call!(context, { payload })
      return functions[functionName](payload, context)
    }

    return right(fn as ReturnedFunction)
  }

  return right(functions[functionName] as ReturnedFunction)
}
