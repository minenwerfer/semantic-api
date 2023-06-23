import type { collections } from '../api'

declare module '@savitri/web' {
  type UserCollections = typeof collections

  export function useStore(storeId: keyof UserCollections): any
}
