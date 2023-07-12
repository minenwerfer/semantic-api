import type { Description } from '@semantic-api/types'
import type { Schema } from './collection'
import type { Config, ApiConfig, FunctionPath, DecodedToken, ResourceType } from './types'
import type { AccessControl } from '@semantic-api/access-control'
import mongoose, { type Model } from 'mongoose'
import { validateFromDescription } from './collection/validate'
import { limitRate, type RateLimitingParams } from './rateLimiting'
import { unsafe } from '@semantic-api/common'

type CollectionModel<TDescription extends Description> =
  Model<Schema<TDescription>>

type Models = {
  [K in keyof Collections]: CollectionModel<Collections[K]['description']>
}

export type ContextOptions<
  TCollections extends Collections,
  TAlgorithms extends Algorithms
> = {
  config?: Config<any, any>,
  parentContext?: Context<any, TCollections, TAlgorithms>,
  resourceType?: ResourceType
  resourceName?: keyof Collections
}

export type Context<
  TDescription extends Description,
  TCollections extends Collections,
  TAlgorithms extends Algorithms
> = Omit<Awaited<ReturnType<typeof internalCreateContext>>, 'collection' | 'collections'> & {
  description: TDescription
  model:  CollectionModel<TDescription>
  collection: TCollections[TDescription['$id']]
  collections: TCollections
  functionPath: FunctionPath
  token: DecodedToken

  resourceName: string
  request: any
  h: any

  apiConfig: ApiConfig
  accessControl: AccessControl<TCollections, TAlgorithms>
  log: (message: string, details?: any) => any
  validate: typeof validateFromDescription
  limitRate: (params: RateLimitingParams) => ReturnType<typeof limitRate>
}

export const internalCreateContext = async <
  TCollections extends Collections,
  TAlgorithms extends Algorithms
>(options?: Pick<ContextOptions<TCollections, TAlgorithms>, 'resourceName' | 'resourceType'>) => {
  const {
    resourceName,
    resourceType = 'collection',
  } = options||{}

  const { getResources, getResourceAsset, getAccessControl } = await import('./assets')
  const { collections, algorithms } = await getResources()
  const accessControl = await getAccessControl()

  return {
    accessControl,
    description: (resourceName && resourceType === 'collection') && unsafe(await getResourceAsset(resourceName, 'description')),
    model: (resourceName && resourceType === 'collection') && unsafe(await getResourceAsset(resourceName, 'model'), resourceName),
    collection: (resourceName && resourceType === 'collection') && await collections[resourceName](),
    algorithms: new Proxy<Algorithms>({}, {
      get: <TResourceName extends keyof typeof algorithms>(_: unknown, resourceName: TResourceName) => {
        return algorithms[resourceName]?.()
      }
    }),
    collections: new Proxy<Collections>({}, {
      get: <TResourceName extends keyof typeof collections>(_: unknown, resourceName: TResourceName) => {
        return collections[resourceName]?.()
      }
    }),
    models: new Proxy<Models>({} as Models, {
      get: (_, key: keyof Collections) => {
        return mongoose.models[String(key)]
      }
    }),
    apiConfig: {},

    validate: validateFromDescription,
    log: async (message: string, details?: string) => {
      return collections.log().functions.insert({
        what: {
          message,
          details,
          context: resourceName,
          // @ts-ignore
          owner: options?.parentContext.token?.user._id
        }
      }, {
        // @ts-ignore
        ...options?.parentContext || {},
        description: unsafe(await getResourceAsset('log', 'description')),
        model: unsafe(await getResourceAsset('log', 'model'))
      })
    },
    limitRate: (params: RateLimitingParams): any => {
      // @ts-ignore
      return limitRate(options?.parentContext, params)
    }
  }
}

export const createContext = async <
  TDescription extends Description,
  TCollections extends Collections,
  TAlgorithms extends Algorithms
>(options?: ContextOptions<TCollections, TAlgorithms>) => {
  const {
    parentContext = {},
    config = {},
    resourceName = null
  } = options||{}

 const context = Object.assign({}, parentContext)
 Object.assign(context, await internalCreateContext(options))
 Object.assign(context, config)

 Object.assign(context, {
   resourceName
 })

 return context as Context<TDescription, TCollections, TAlgorithms>
}
