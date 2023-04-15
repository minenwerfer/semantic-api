import { existsSync } from 'fs'

import type { Model } from 'mongoose'
import type {
  ApiFunction ,
  AnyFunctions,
  AssetType,
  ResourceType,
  Resource,
  CollectionResource,
  AlgorithmResource,
  FunctionPath,
  ApiContext

} from '../types'

import {
  RESOURCE_TYPES,
  ASSET_TYPES,
} from '../types'

import { arraysIntersects } from '@semantic-api/common'
import { getCollections, getAlgorithms } from '@semantic-api/system'
// import SystemCollections from '@semantic-api/system/resources/collections/index.js'
// import SystemAlgorithms from '@semantic-api/system/resources/algorithms/index.js'
import type { CollectionFunctions } from './collection/functions.types'
import { validateFromDescription, ValidateFunction } from './collection/validate'
import { limitRate } from './rateLimiting'
import { render } from './render'

// global.PREBUNDLED_ASSETS ??= {}

// const __cached: Record<AssetType, Record<string, any>> = {
//   model: {},
//   description: {},
//   function: {},
//   library: {}
// }

// export const requireWrapper = (path: string) => {
//   const resolvedPath = path.replace(process.cwd(), '.')
//   if( PREBUNDLED_ASSETS?.[resolvedPath] ) {
//     return PREBUNDLED_ASSETS[resolvedPath]
//   }

//   const content = require(path)
//   return content.default || content
// }


// const cacheIfPossible = (assetName: string, assetType: AssetType, fn: () => any) => {
//   const repo = __cached[assetType]
//   if( assetName in repo ) {
//     return repo[assetName]
//   }

//   const asset = repo[assetName] = fn()
//   return asset
// }

// const isInternal = (resourceName: string, resourceType: ResourceType = 'collection'): boolean => {
//   switch( resourceType ) {
//     case 'collection': return resourceName in SystemCollections
//     case 'algorithm': return resourceName in SystemAlgorithms
//   }
// }

// const getPrefix = (collectionName: string, internal: boolean, resourceType: ResourceType = 'collection') => {
//   const pluralized = (() => {
//     switch( resourceType ) {
//       case 'collection': return 'collections'
//       case 'algorithm': return 'algorithms'
//     }
//   })()

//   return internal
//     ? `@semantic-api/system/resources/${pluralized}/${collectionName}`
//     : `${process.cwd()}/resources/${pluralized}/${collectionName}`
// }

// const loadDescription = (collectionName: string, internal: boolean) => {
//   const prefix = getPrefix(collectionName, internal)
//   const isValid = !collectionName.startsWith('_'),
//     isJson = isValid && existsSync(`${prefix}/${collectionName}.description.json`),
//     path = require.resolve(`${prefix}/${collectionName}.description${isJson ? '.json' : '.js'}`)

//   if( !isValid ) {
//     return null
//   }
  
//   return requireWrapper(path)
// }

// const loadModel = (collectionName: string, internal: boolean): Model<any>|null => {
//   const prefix = getPrefix(collectionName, internal)
//   return requireWrapper(`${prefix}/${collectionName}.model.js`)
// }

// const loadModelWithFallback = async (collectionName: string, internal: boolean) => {
//   try {
//     return loadModel(collectionName, internal)

//   } catch( e: any ) {
//     if( e.code !== 'MODULE_NOT_FOUND' ) {
//       throw e
//     }

//     const description = getResourceAsset(collectionName, 'description')
//     const { createModel } = require(`@semantic-api/api/collection/schema.js`)
//     return createModel(description)
//   }
// }

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

  const wrapper: ApiFunction = async (props, context) => {
    const { useCollection } = require(`@semantic-api/api/collection/use.js`)
    context.functionPath = functionPath

    const newContext: ApiContext = {
      ...context,
      descriptions: global.descriptions,
      resourceName,
      validate: (..._args: [any]) => null,
      limitRate: (...args: [any]) => {
        return limitRate(context, ...args)
      },
      hasRoles: (roles: Array<string>|string) => arraysIntersects(roles, context.token.user.roles),
      log: async (message, details) => {
        return (await useCollection('log', context)).insert({
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
      library: getResourceAsset(resourceName, 'library', resourceType),
      render: (...args: [any, any]) => render.apply({}, [context.h, ...args])
    }

    if( resourceType === 'collection' ) {
      const description = getResourceAsset(resourceName, 'description')
      newContext.model = async () => getResourceAsset(resourceName, 'model')
      newContext.description = description
      newContext.validate = (...args: Parameters<ValidateFunction<any>>) => {
        const targetDescription = args.length === 3
          ? args.pop()
          : description

        return validateFromDescription(targetDescription, ...args)
      }
      newContext.collection = await useCollection(resourceName, newContext)
      newContext.hasCategories = (categories: Array<string>|string) => {
        if( !description.categories ) {
          return false
        }

        return arraysIntersects(categories, description.categories)
      }
    }

    newContext.collections = new Proxy({}, {
      get: (_, resourceName: string) => {
        return proxyFn(resourceName, newContext)
      }
    })

    newContext.algorithms = new Proxy({}, {
      get: (_, resourceName: string) => {
        return proxyFn(resourceName, newContext, 'algorithm')
      }
    })

    return fn(props, newContext)
  }

  return wrapper
}


// const loadFunction = (functionPath: FunctionPath, resourceType: ResourceType = 'collection', internal: boolean = false) => {
//   const [resourceName] = functionPath.split('@')
//   const prefix = getPrefix(resourceName, internal, resourceType)

//   const originalFn = requireWrapper(`${prefix}/functions/${functionPath}.js`)
//   return wrapFunction(originalFn, functionPath, resourceType)
// }

// const loadFunctionWithFallback = (functionPath: FunctionPath, resourceType: ResourceType, internal: boolean) => {
//   try {
//     return loadFunction(functionPath, resourceType, internal)
//   } catch( e: any ) {
//     if( e.code !== 'MODULE_NOT_FOUND' || resourceType !== 'collection' ) {
//       throw e
//     }

//     const [resourceName, functionName] = functionPath.split('@')
//     const { useCollection } = require(`@semantic-api/api/collection/use.js`)

//     const fn: ApiFunction<any> = async (props, context) => {
//       const method = (await useCollection(resourceName, context))[functionName as keyof CollectionFunctions]
//       if( !method || typeof method !== 'function' ) {
//         throw new TypeError(
//           `no such function ${functionPath}`
//         )
//       }

//       return method(props)
//     }

//     return wrapFunction(fn, functionPath, resourceType)
//   }
// }

// const loadLibrary = (resourceName: string, resourceType: ResourceType = 'collection', internal: boolean = false) => {
//   try {
//     const prefix = getPrefix(resourceName, internal, resourceType)
//     return require(`${prefix}/${resourceName}.library.js`)
//   } catch( e: any ) {
//     if( e.code !== 'MODULE_NOT_FOUND' ) {
//       throw e
//     }

//     return {}
//   }
// }

export const getResourceAsset = <_AssetType extends AssetType>(
  assetName: _AssetType extends 'function'
    ? FunctionPath
    : string,
  assetType: _AssetType,
  resourceType: ResourceType = 'collection'
) => {
  // const resources = (() => {
  //   switch( resourceType ) {
  //     case 'collection': return getCollections()
  //     case 'algorithm': return getAlgorithms()
  //   }
  // })()

  // if( !resources ) {
  //   throw new Error()
  // }

  // if( assetType === 'function' ) {
  //   const [resourceName, functionName] = assetName.split('@')
  //   const fn = (() => {
  //     const fn = resources[resourceName].functions[functionName]
  //     if( fn ) {
  //       return fn
  //     }

  //     const { useCollection } = require(`@semantic-api/api/collection/use.js`)
  //     const fallback: ApiFunction<any> = async (props, context) => {
  //       const verb = (await useCollection(resourceName, context))[functionName as keyof CollectionFunctions]
  //       if( !verb || typeof verb !== 'function' ) {
  //         throw new TypeError(
  //           `no such function ${assetName}`
  //         )
  //       }

  //       return verb(props)
  //     }

  //     return fallback
  //   })()

  //   return wrapFunction(fn, assetName as FunctionPath, resourceType)
  // }

  switch( resourceType ) {
    case 'collection': {
      const resources = getCollections()
      return resources[assetName].model
    }

    case 'algorithm': {
      const resources = getAlgorithms()
      return resources[assetName]
    }
  }

  // if( resourceType === 'collection' ) {
  //   return resources[assetName].model
  // }

  // const _assetType = ASSET_TYPES[assetType]
  // return resources[assetName][_assetType]

  // return cacheIfPossible(
  //   assetName,
  //   assetType,
  //   () => {
  //     const resourceName = assetType === 'function'
  //       ? assetName.split('@').shift()!
  //       : assetName

  //     // const internal = isInternal(resourceName, resourceType)
  //     const internal = true

  //     if( resourceName !== 'meta' ) {
  //       const description = global.descriptions?.[resourceName]
  //       if( description ) {
  //         switch( assetType ) {
  //           case 'description':
  //             return description
  //           case 'model':
  //             return description?.model
  //               || loadModelWithFallback(assetName, internal)
  //           case 'function': {
  //             const fn = description.functions?.[assetName.split('@').pop()!]
  //             return fn
  //               ? wrapFunction(fn, assetName as FunctionPath, resourceType)
  //               : loadFunctionWithFallback(assetName as FunctionPath, resourceType, internal)
  //           }
  //         }
  //       }
  //     }

  //     switch( assetType ) {
  //       case 'description':
  //         return loadDescription(assetName, internal)
  //       case 'model':
  //         return loadModelWithFallback(assetName, internal)
  //       case 'function':
  //         return loadFunctionWithFallback(assetName as FunctionPath, resourceType, internal)
  //       case 'library':
  //         return loadLibrary(assetName, resourceType, internal)
  //     }
  //   }
  // )
}

export const getResourceFunction = (functionPath: FunctionPath, resourceType: ResourceType = 'collection') => {
  return getResourceAsset(functionPath, 'function', resourceType)
}
