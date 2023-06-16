import type { Model } from 'mongoose'
import { algorithms, collections } from '@semantic-api/system'

type CollectionNames = keyof UserConfig['collections']

type Models = {
  [Coll in CollectionNames]: Model<UserConfig['collections'][Coll]['description']>
}

export const createContext = async () => {
  const { getResourceAsset } = await import('./assets')

  return {
    algorithms,
    collections,
    models: new Proxy<Models>({}, {
      get: (_, key) => {
        return getResourceAsset(String(key), 'model')
      }
    })
  }
}

// const ctx = createContext()

// ctx.collections.ax.name 
