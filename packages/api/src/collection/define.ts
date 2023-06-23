import type { Collection } from '../types'

export const defineCollection = <const TCollection extends Awaited<ReturnType<Collection>>>(t: () => TCollection|Promise<TCollection>) => {
  return () => t()
}
