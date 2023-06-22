import type { Model } from 'mongoose'
import { algorithms, collections } from '@semantic-api/system'

type Models = {
  [K in keyof Collections]: Model<Collections[K]['description']>
}

export const createContext = async () => {
  const { getResourceAsset } = await import('./assets')

  return {
    algorithms,
    collections,
    models: new Proxy<Models>({}, {
      get: (_, key) => {
        return getResourceAsset(String(key) as keyof Collections, 'model')
      }
    })
  }
}

// const ctx = createContext()

// ctx.collections.ax.name 
