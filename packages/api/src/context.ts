import type { Model } from 'mongoose'

type CollectionNames = keyof UserConfig['collections']

type Collections = {
  [Coll in CollectionNames]: UserConfig['collections'][Coll]['functions']
}

type Models = {
  [Coll in CollectionNames]: Model<UserConfig['collections'][Coll]['description']>
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
        return getResourceAsset(String(key), 'model')
      }
    })
  }
}

// const ctx = createContext()

// ctx.collections.ax.name 
