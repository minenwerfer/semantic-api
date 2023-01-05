import { existsSync } from 'fs'

import type { Model } from 'mongoose'
import type {
  ApiFunction ,
  AnyFunctions,
  AssetType,
  EntityType,
  FunctionPath,
  AssetReturnType,
  ApiContext

} from '../types'

import { arraysIntersects } from '../../common'
import { default as SystemCollections } from '../../system/collections'
import { default as SystemControllables } from '../../system/controllables'
import type { CollectionFunctions } from './collection/functions.types'
import { validateFromDescription, ValidateFunction } from './collection/validate'
import { useCollection, createModel } from './collection'

const __cached: Record<AssetType, Record<string, any>> = {
  model: {},
  description: {},
  function: {}
}

const cacheIfPossible = (assetName: string, assetType: AssetType, fn: () => any) => {
  const repo = __cached[assetType]
  if( assetName in repo ) {
    return repo[assetName]
  }

  const asset = repo[assetName] = fn()
  return asset
}

const isInternal = (entityName: string, entityType: EntityType = 'collection'): boolean => {
  switch(  entityType ) {
    case 'collection': return entityName in SystemCollections
    case 'controllable': return entityName in SystemControllables
  }
}

const getPrefix = (collectionName: string, internal: boolean, entityType: EntityType = 'collection') => {
  const pluralized = (() => {
    switch( entityType ) {
      case 'collection': return 'collections'
      case 'controllable': return 'controllables'
    }
  })()

  return internal
    ? `${__dirname}/../../system/${pluralized}/${collectionName}`
    : `${process.cwd()}/${pluralized}/${collectionName}`
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

    const description = getEntityAsset(collectionName, 'description')
    return createModel(description)
  }
}

const wrapFunction = (fn: ApiFunction, functionPath: FunctionPath, entityType: EntityType) => {
  const [entityName] = functionPath.split('@')
  const proxyFn = (entityName: string, context: any, _entityType?: EntityType) => {
    return new Proxy({}, {
      get: (_, entityFunction: string) => {
        const asset = getEntityFunction(`${entityName}@${entityFunction}`, _entityType)
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
        const description = getEntityAsset(entityName, 'description')
        if( !description.categories ) {
          return false
        }

        return arraysIntersects(categories, description.categories)
      },
      log: (message, details) => {
        return useCollection('log', context).insert({
          what: {
            message,
            details,
            context: entityName,
            owner: context.token.user?._id
          }
        })
      },
      collection: {} as CollectionFunctions,
      entity: proxyFn(entityName, context, entityType)
    }

    if( entityType === 'collection' ) {
      const description = getEntityAsset(entityName, 'description')
      newContext.validate = (...args: Parameters<ValidateFunction<any>>) => validateFromDescription(description, ...args)
      newContext.collection = useCollection(entityName, newContext)
    }

    newContext.collections = new Proxy({}, {
      get: (_, entityName: string) => {
        return proxyFn(entityName, newContext)
      }
    })

    newContext.controllables = new Proxy({}, {
      get: (_, entityName: string) => {
        return proxyFn(entityName, newContext, 'controllable')
      }
    })

    return fn(props, newContext)
  }

  return wrapper
}


const loadFunction = (functionPath: FunctionPath, entityType: EntityType = 'collection', internal: boolean = false) => {
  const [entityName] = functionPath.split('@')
  const prefix = getPrefix(entityName, internal, entityType)

  const originalFn: ApiFunction = require(`${prefix}/functions/${functionPath}`).default
  return wrapFunction(originalFn, functionPath, entityType)
}

const loadFunctionWithFallback = (functionPath: FunctionPath, entityType: EntityType, internal: boolean) => {
  try {
    return loadFunction(functionPath, entityType, internal)
  } catch( e: any ) {
    if( e.code !== 'MODULE_NOT_FOUND' || entityType !== 'collection' ) {
      throw e
    }

    const [entityName, functionName] = functionPath.split('@')
    const fn: ApiFunction<any> = (props, context) => {
      const method = useCollection(entityName, context)[functionName as keyof CollectionFunctions]
      if( !method || typeof method !== 'function' ) {
        throw new TypeError(
          `no such function ${functionPath}`
        )
      }

      return method(props)
    }

    return wrapFunction(fn, functionPath, entityType)
  }
}

export const getEntityAsset = <Type extends AssetType>(
  assetName: Type extends 'function'
    ? FunctionPath
    : string,
  assetType: Type,
  entityType: EntityType = 'collection'
): AssetReturnType<Type> => {
  return cacheIfPossible(
    assetName,
    assetType,
    () => {
      const entityName = assetType === 'function'
        ? assetName.split('@').shift()!
        : assetName

      const internal = isInternal(entityName, entityType)

      if( entityName !== 'meta' ) {
        const description = global.descriptions?.[entityName]
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
                ? wrapFunction(fn, assetName as FunctionPath, entityType)
                : loadFunctionWithFallback(assetName as FunctionPath, entityType, internal)
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
          return loadFunctionWithFallback(assetName as FunctionPath, entityType, internal)
      }
    }
  )
}

export const getEntityFunction = (functionPath: FunctionPath, entityType: EntityType = 'collection') => {
  return getEntityAsset(functionPath, 'function', entityType)
}
