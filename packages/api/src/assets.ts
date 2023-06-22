// import { existsSync } from 'fs'
// import type { Model } from 'mongoose'
import type {
  ApiFunction ,
  ResourceType,
  AssetType,
  FunctionPath,
  ApiContext

} from './types'

import { arraysIntersects, left, right, isLeft, unwrapEither, Right } from '@semantic-api/common'
// import SystemCollections from '@semantic-api/system/resources/collections/index.js'
// import SystemAlgorithms from '@semantic-api/system/resources/algorithms/index.js'
// import type { DecodedToken } from '../types/server'
//
import { isGranted, ACErrors } from '@semantic-api/access-control'
import { validateFromDescription, ValidateFunction } from './collection/validate'
import { limitRate } from './rateLimiting'

// global.PREBUNDLED_ASSETS ??= {}

// const __cached: Record<AssetName, Record<string, any>> = {
//   model: {},
//   description: {},
//   function: {},
// }

export const requireWrapper = (path: string) => {
  const content = require(path)
  return content.default || content
}


// const cacheIfPossible = (resourceName: string, assetName: AssetName, fn: () => any) => {
//   const repo = __cached[assetName]
//   if( resourceName in repo ) {
//     return repo[resourceName]
//   }

//   const asset = repo[resourceName] = fn()
//   return asset
// }

// const isInternal = (resourceName: string, resourceType: ResourceType = 'collection'): boolean => {
//   switch(  resourceType ) {
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

// const wrapFunction = (fn: ApiFunction, functionPath: FunctionPath, resourceType: ResourceType) => {
//   const [resourceName] = functionPath.split('@')
//   // const proxyFn = (resourceName: string, context: any, _resourceType?: ResourceType) => {
//   //   return new Proxy({}, {
//   //     get: async (_, resourceFunction: string) => {
//   //       // const asset = await getResourceFunction(`${resourceName}@${resourceFunction}`, _resourceType)
//   //       // return typeof asset === 'function'
//   //       //   ? (props?: any) => asset(props, context)
//   //       //   : asset
//   //     }      
//   //   }) as AnyFunctions
//   // }

//   const wrapper: ApiFunction = async (props, context) => {
//     const { useCollection } = require(`@semantic-api/api/collection/use.js`)
//     context.functionPath = functionPath

//     const newContext: ApiContext = {
//       ...context,
//       descriptions: global.descriptions,
//       resourceName,
//       validate: (..._args: [any]) => null,
//       limitRate: (...args: [any]) => {
//         return limitRate(context, ...args)
//       },
//       hasRoles: (roles: Array<string>|string) => arraysIntersects(roles, context.token.user.roles),
//       log: async (message, details) => {
//         return (await useCollection('log', context)).insert({
//           what: {
//             message,
//             details,
//             context: resourceName,
//             owner: context.token.user?._id
//           }
//         })
//       },
//     }

//     if( resourceType === 'collection' ) {
//       const description = await getResourceAsset(resourceName, 'description')
//       newContext.model = await getResourceAsset(resourceName, 'model'),
//       newContext.description = description
//       newContext.validate = (...args: Parameters<ValidateFunction<any>>) => {
//         const targetDescription = args.length === 3
//           ? args.pop()
//           : description

//         return validateFromDescription(targetDescription, ...args)
//       }
//       newContext.collection = await useCollection(resourceName, newContext)
//       newContext.hasCategories = (categories: Array<string>|string) => {
//         if( !description.categories ) {
//           return false
//         }

//         return arraysIntersects(categories, description.categories)
//       }
//     }

//     // newContext.collections = new Proxy({}, {
//     //   get: (_, resourceName: string) => {
//     //     return proxyFn(resourceName, newContext)
//     //   }
//     // })

//     // newContext.algorithms = new Proxy({}, {
//     //   get: (_, resourceName: string) => {
//     //     return proxyFn(resourceName, newContext, 'algorithm')
//     //   }
//     // })

//     return fn(props, newContext)
//   }

//   return wrapper
// }


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

// export const getResourceAsset = <Type extends AssetName>(
//   resourceName: Type extends 'function'
//     ? FunctionPath
//     : string,
//   assetName: Type,
//   resourceType: ResourceType = 'collection'
// ): AssetReturnType<Type> => {
//   return cacheIfPossible(
//     resourceName,
//     assetName,
//     () => {
//       const resourceName = assetName === 'function'
//         ? resourceName.split('@').shift()!
//         : resourceName

//       const internal = isInternal(resourceName, resourceType)

//       if( resourceName !== 'meta' ) {
//         const description = global.descriptions?.[resourceName]
//         if( description ) {
//           switch( assetName ) {
//             case 'description':
//               return description
//             case 'model':
//               return description?.model
//                 || loadModelWithFallback(resourceName, internal)
//             case 'function': {
//               const fn = description.functions?.[resourceName.split('@').pop()!]
//               return fn
//                 ? wrapFunction(fn, resourceName as FunctionPath, resourceType)
//                 : loadFunctionWithFallback(resourceName as FunctionPath, resourceType, internal)
//             }
//           }
//         }
//       }

//       switch( assetName ) {
//         case 'description':
//           return loadDescription(resourceName, internal)
//         case 'model':
//           return loadModelWithFallback(resourceName, internal)
//         case 'function':
//           return loadFunctionWithFallback(resourceName as FunctionPath, resourceType, internal)
//         case 'library':
//           return loadLibrary(resourceName, resourceType, internal)
//       }
//     }
//   )
// }
//
export const getResourceAsset = async <
  const ResourceName extends keyof Collections,
  const AssetName extends keyof Collections[ResourceName] & AssetType
>(
  resourceName: ResourceName,
  assetName: AssetName,
) => {
  const collections = await import('@semantic-api/system/collections')
  const userConfig = await import(process.cwd() + '/index.js')
  const config: typeof userConfig = {}

  Object.assign(config, userConfig)
  Object.assign(config, { collections })

  const key = 'collections'
  if( !(resourceName in config[key]) ) return left('RESOURCE_NOT_FOUND')
  if( !(assetName in config[key][resourceName]()) ) return left('ASSET_NOT_FOUND')

  const asset = (await config[key][resourceName]())[assetName] as Collections[ResourceName][AssetName]

  const result = right(asset)
  return result as Exclude<typeof result, Right<never>>
}

export const get = getResourceAsset

export const getFunction = async <
  ResourceName extends keyof Collections,
  FunctionName extends keyof Collections[ResourceName]['functions'],
  ReturnedFunction=ResourceName extends keyof UserConfig['collections']
      ? FunctionName extends keyof Collections[ResourceName]['functions']
        ? Collections[ResourceName]['functions'][FunctionName]
        : never
        : never
>(
  resourceName: ResourceName,
  functionName: FunctionName,
  acProfile?: UserACProfile
) => {
  if( acProfile ) {
    if( !await isGranted(resourceName, String(functionName), acProfile) ) {
      return left(ACErrors.AuthorizationError)
    }
  }

  const functionsEither = await getResourceAsset(resourceName, 'functions')
  if( isLeft(functionsEither) ) {
    return functionsEither
  }

  const functions = unwrapEither(functionsEither) 
  return right(functions![functionName] as ReturnedFunction)
}
