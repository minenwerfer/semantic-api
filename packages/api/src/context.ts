import type { Description } from '@semantic-api/types'
import type { Schema } from './collection'
import type { Config, FunctionPath, DecodedToken, ResourceType } from './types'
import type { AccessControl } from '@semantic-api/access-control'
import mongoose, { type Model } from 'mongoose'
import { unsafe } from '@semantic-api/common'

type Models = {
  [K in keyof Collections]: Model<Schema<Collections[K]['description']>>
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
  model: TDescription['$id'] extends keyof Collections
    ? Models[TDescription['$id']]
    : never
  collection: TDescription['$id'] extends keyof Collections
    ? TCollections[TDescription['$id']]
    : never
  collections: TCollections
  functionPath: FunctionPath
  token: DecodedToken

  resourceName: string
  request: any
  h: any

  apiConfig: any
  accessControl: AccessControl<TCollections>
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
    model: (resourceName && resourceType === 'collection') && unsafe(await getResourceAsset(resourceName, 'model')),
    collection: {} as any,
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
