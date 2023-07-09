import type { Description } from '@semantic-api/types'
import type { Schema } from './collection'
import type { FunctionPath, DecodedToken } from './types'
import mongoose, { Model } from 'mongoose'
import { algorithms, collections } from '@semantic-api/system'

type Models = {
  [K in keyof Collections]: Model<Schema<Collections[K]['description']>>
}

export type Context<
  TDescription extends Description,
  TCollections extends Collections
> = Omit<Awaited<ReturnType<typeof createContext>>, 'collection' | 'collections'> & {
  model: Models[TDescription['$id']]
  collection: TCollections[TDescription['$id']]
  collections: TCollections
  functionPath: FunctionPath
  token: DecodedToken
}

export const createContext = async (collectionName: keyof Collections) => {
  const { getResourceAsset } = await import('./assets')

  return {
    model: await getResourceAsset(collectionName, 'model'),
    algorithms,
    collection: {} as any,
    collections: new Proxy<Collections>({}, {
      get: <TCollName extends keyof typeof collections>(_: unknown, collectionName: TCollName) => {
        return collections[collectionName]?.()
      }
    }),
    models: new Proxy<Models>({}, {
      get: (_, key: keyof Collections) => {
        return mongoose.models[String(key)]
      }
    })
  }
}
