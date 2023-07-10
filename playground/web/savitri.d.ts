import type { Context } from '@semantic-api/api'

declare module '@savitri/web' {
  type UserCollections = typeof import('api').collections
  type SystemCollections = typeof import('@semantic-api/system/collections')

  type Collections = {
    [K in keyof (UserCollections & SystemCollections)]: Awaited<ReturnType<(UserCollections & SystemCollections)[K]>>
  }

  export function useStore<StoreId extends keyof Collections>(storeId: StoreId): {
    ui: Collections[StoreId]
    functions: {
      [P in keyof Collections[StoreId]['functions']]: (arg: Parameters<Collections[StoreId]['functions'][P]>[0]) => ReturnType<Collections[StoreId]['functions'][P]>
    }
    item: Collections[StoreId]['item']
    items: Array<Collections[StoreId]['item']>
  }
}
