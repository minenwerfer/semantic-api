declare module '@savitri/web' {
  import type { collections } from 'api'
  import type { Context } from '@semantic-api/api'
  import * as SystemCollections from '@semantic-api/system/collections'

  type TrimLast<T extends any[]> = T extends [...infer Head, infer Last]
    ? Last extends Context<any, any>
      ? Head
      : [...Head, Last]
    : unknown

  type UserCollections = typeof collections
  type Collections = {
    [K in keyof (UserCollections & typeof SystemCollections)]: Awaited<ReturnType<(UserCollections & typeof SystemCollections)[K]>>
  }

  export function useStore<StoreId extends keyof Collections>(storeId: StoreId): {
    functions: {
      [P in keyof Collections[StoreId]['functions']]: (...args: TrimLast<Parameters<Collections[StoreId]['functions'][P]>>) => ReturnType<Collections[StoreId]['functions'][P]>
    }
    item: Collections[StoreId]['item']
    items: Array<Collections[StoreId]['item']>
  }
}
