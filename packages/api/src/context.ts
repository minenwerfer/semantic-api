import type { Model } from 'mongoose'

type CollectionNames = keyof TesteConfig['collections']

type Collections = {
  [Coll in CollectionNames]: TesteConfig['collections'][Coll]['functions']
}

type Models = {
  [Coll in CollectionNames]: Model<TesteConfig['collections'][Coll]['description']>
}

export const createContext = async () => {
  const { getResourceAsset } = await import('./assets')

  return {
    collections: new Proxy<Collections>({}, {
      get: (_, key) => {
        return 'oi'
      }
    }),
    models: new Proxy<Models>({}, {
      get: (_, key) => {
        return getResourceAsset(key, 'model')
      }
    })
  }
}

const ctx = createContext()

ctx.collections.ax.name 
