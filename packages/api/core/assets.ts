import { existsSync } from 'fs'

import type { Model } from 'mongoose'
import type {
  ApiFunction ,
  AnyFunctions,
  AssetType,
  ResourceType,
  FunctionPath,
  AssetReturnType,
  ApiContext

} from '../types'

import { arraysIntersects } from '../../common'
import { default as SystemCollections } from '../../system/resources/collections'
import { default as SystemControllables } from '../../system/resources/controllables'
import type { CollectionFunctions } from './collection/functions.types'
import type { Log } from '../../system/resources/collections/log/log.description'
import { validateFromDescription, ValidateFunction } from './collection/validate'
import { useCollection, createModel } from './collection'

const __cached: Record<AssetType, Record<string, any>> = {
  model: {},
  description: {},
  function: {},
  library: {}
}

const cacheIfPossible = (assetName: string, assetType: AssetType, fn: () => any) => {
  const repo = __cached[assetType]
  if( assetName in repo ) {
    return repo[assetName]
  }

  const asset = repo[assetName] = fn()
  return asset
}

const isInternal = (resourceName: string, resourceType: ResourceType = 'collection'): boolean => {
  switch(  resourceType ) {
    case 'collection': return resourceName in SystemCollections
    case 'controllable': return resourceName in SystemControllables
  }
}

const getPrefix = (collectionName: string, internal: boolean, resourceType: ResourceType = 'collection') => {
  const pluralized = (() => {
    switch( resourceType ) {
      case 'collection': return 'collections'
      case 'controllable': return 'controllables'
    }
  })()

  return internal
    ? `${__dirname}/../../system/resources/${pluralized}/${collectionName}`
    : `${process.cwd()}/resources/${pluralized}/${collectionName}`
}

const loadDescription = (collectionName: string, internal: boolean) => {
  const prefix = getPrefix(collectionName, internal)
  const isValid = !collectionName.startsWith('_'),
    isJson = isValid && existsSync(`${prefix}/${collectionName}.description.json`),
    path = require.resolve(`${prefix}/${collectionName}.description${isJson ? '.json' : ''}`)

  if( !isValid ) {
    return null
  }
  
  return isJson
    ? require(path)
    : require(path).default
}

const loadModel = (collectionName: string, internal: boolean): Model<any>|null => {
  const prefix = getPrefix(collectionName, internal)
  return require(`${prefix}/${collectionName}.model`).default
}

const loadModelWithFallback = (collectionName: string, internal: boolean) => {
  try {
    return loadModel(collectionName, internal)

  } catch( e: any ) {
    if( e.code !== 'MODULE_NOT_FOUND' ) {
      throw e
    }

    const description = getResourceAsset(collectionName, 'description')
    return createModel(description)
  }
}

const wrapFunction = (fn: ApiFunction, functionPath: FunctionPath, resourceType: ResourceType) => {
  const [resourceName] = functionPath.split('@')
  const proxyFn = (resourceName: string, context: any, _resourceType?: ResourceType) => {
    return new Proxy({}, {
      get: (_, resourceFunction: string) => {
        const asset = getResourceFunction(`${resourceName}@${resourceFunction}`, _resourceType)
        return typeof asset === 'function'
          ? (props?: any) => asset(props, context)
          : asset
      }      
    }) as AnyFunctions
  }

  const wrapper: ApiFunction = (props, context) => {
    const newContext: ApiContext = {
      ...context,
      validate: (...args: any[]) => null,
      hasRoles: (roles: Array<string>|string) => arraysIntersects(roles, context.token.user.roles),
      hasCategories: (categories: Array<string>|string) => {
        const description = getResourceAsset(resourceName, 'description')
        if( !description.categories ) {
          return false
        }

        return arraysIntersects(categories, description.categories)
      },
      log: (message, details) => {
        return useCollection<Log>('log', context).insert({
          what: {
            message,
            details,
            context: resourceName,
            owner: context.token.user?._id
          }
        })
      },
      collection: {} as CollectionFunctions,
      resource: proxyFn(resourceName, context, resourceType),
      library: getResourceAsset(resourceName, 'library', resourceType)
    }

    if( resourceType === 'collection' ) {
      const description = getResourceAsset(resourceName, 'description')
      newContext.validate = (...args: Parameters<ValidateFunction<any>>) => validateFromDescription(description, ...args)
      newContext.collection = useCollection(resourceName, newContext)
    }

    newContext.collections = new Proxy({}, {
      get: (_, resourceName: string) => {
        return proxyFn(resourceName, newContext)
      }
    })

    newContext.controllables = new Proxy({}, {
      get: (_, resourceName: string) => {
        return proxyFn(resourceName, newContext, 'controllable')
      }
    })

    return fn(props, newContext)
  }

  return wrapper
}


const loadFunction = (functionPath: FunctionPath, resourceType: ResourceType = 'collection', internal: boolean = false) => {
  const [resourceName] = functionPath.split('@')
  const prefix = getPrefix(resourceName, internal, resourceType)

  const originalFn: ApiFunction = require(`${prefix}/functions/${functionPath}`).default
  return wrapFunction(originalFn, functionPath, resourceType)
}

const loadFunctionWithFallback = (functionPath: FunctionPath, resourceType: ResourceType, internal: boolean) => {
  try {
    return loadFunction(functionPath, resourceType, internal)
  } catch( e: any ) {
    if( e.code !== 'MODULE_NOT_FOUND' || resourceType !== 'collection' ) {
      throw e
    }

    const [resourceName, functionName] = functionPath.split('@')
    const fn: ApiFunction<any> = (props, context) => {
      const method = useCollection(resourceName, context)[functionName as keyof CollectionFunctions]
      if( !method || typeof method !== 'function' ) {
        throw new TypeError(
          `no such function ${functionPath}`
        )
      }

      return method(props)
    }

    return wrapFunction(fn, functionPath, resourceType)
  }
}

const loadLibrary = (resourceName: string, resourceType: ResourceType = 'collection', internal: boolean = false) => {
  try {
    const prefix = getPrefix(resourceName, internal, resourceType)
    return require(`${prefix}/${resourceName}.library`)
  } catch( e: any ) {
    if( e.code !== 'MODULE_NOT_FOUND' ) {
      throw e
    }

    return {}
  }
}

export const getResourceAsset = <Type extends AssetType>(
  assetName: Type extends 'function'
    ? FunctionPath
    : string,
  assetType: Type,
  resourceType: ResourceType = 'collection'
): AssetReturnType<Type> => {
  return cacheIfPossible(
    assetName,
    assetType,
    () => {
      const resourceName = assetType === 'function'
        ? assetName.split('@').shift()!
        : assetName

      const internal = isInternal(resourceName, resourceType)

      if( resourceName !== 'meta' ) {
        const description = global.descriptions?.[resourceName]
        if( description ) {
          switch( assetType ) {
            case 'description':
              return description
            case 'model':
              return description?.model
                || loadModelWithFallback(assetName, internal)
            case 'function': {
              const fn = description.functions?.[assetName.split('@').pop()!]
              return fn
                ? wrapFunction(fn, assetName as FunctionPath, resourceType)
                : loadFunctionWithFallback(assetName as FunctionPath, resourceType, internal)
            }
          }
        }
      }

      switch( assetType ) {
        case 'description':
          return loadDescription(assetName, internal)
        case 'model':
          return loadModelWithFallback(assetName, internal)
        case 'function':
          return loadFunctionWithFallback(assetName as FunctionPath, resourceType, internal)
        case 'library':
          return loadLibrary(assetName, resourceType, internal)
      }
    }
  )
}

export const getResourceFunction = (functionPath: FunctionPath, resourceType: ResourceType = 'collection') => {
  return getResourceAsset(functionPath, 'function', resourceType)
}
