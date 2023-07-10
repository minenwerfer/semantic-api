import type { Description } from '@semantic-api/types'
import type { Schema } from './collection'
import type { Config, ApiConfig, FunctionPath, DecodedToken, ResourceType } from './types'
import type { AccessControl } from '@semantic-api/access-control'
import mongoose, { type Model } from 'mongoose'
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
  _TAlgorithms extends Algorithms
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
  accessControl: AccessControl<TCollections>
  log: (...args: any[]) => any
  validate: (...args: any[]) => any
}

export const internalCreateContext = async <
  TCollections extends Collections,
  TAlgorithms extends Algorithms
>(options?: Pick<ContextOptions<TCollections, TAlgorithms>, 'resourceName' | 'resourceType'>) => {
  const {
    resourceName,
    resourceType = 'collection',
  } = options||{}

  const { getResources, getResourceAsset } = await import('./assets')
  const { collections, algorithms } = await getResources()

  return {
    description: (resourceName && resourceType === 'collection') && unsafe(await getResourceAsset(resourceName, 'description')),
    model: (resourceName && resourceType === 'collection') && unsafe(await getResourceAsset(resourceName, 'model'), resourceName),
    collection: (resourceName && resourceType === 'collection') && collections[resourceName],
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
  }
}

export const createContext = async <
  TDescription extends Description,
  TCollections extends Collections,
  TAlgorithms extends Algorithms
>(options?: ContextOptions<TDescription, TAlgorithms>) => {
  const {
    parentContext = {},
    config = {}
  } = options||{}

 const context = Object.assign({}, parentContext)
 Object.assign(context, await internalCreateContext(options))
 Object.assign(context, config)

 return context as Context<TDescription, TCollections, TAlgorithms>
}
