# @semantic-api/access-control

## Types

- [`Role`](#role)
- [`AccessControl`](#access-control)
- [`AccessControlLayer`](#access-control-layer)
- [`ValidAccessControlLayer`](#valid-access-control-layer)

## Global API

- [`defineAccessControl`](#define-access-control)


## Role

```ts
export type Role<
  TCollections extends Record<string, Awaited<ReturnType<Collection>>>,
  TAlgorithms extends Record<string, Awaited<ReturnType<Algorithm>>>
> = {
  inherit?: Array<string>
  grantEverything?: boolean
  forbidEverything?: boolean
  capabilities?: {
    [P in keyof (TCollections & TAlgorithms)]?: {
      grantEverything?: boolean
      forbidEverything?: boolean
      functions?: 'functions' extends keyof (TCollections & TAlgorithms)[P]
        ? Array<keyof (TCollections & TAlgorithms)[P]['functions']>
        : never
      blacklist?: 'functions' extends keyof (TCollections & TAlgorithms)[P]
        ? Array<keyof (TCollections & TAlgorithms)[P]['functions']>
        : never
    }
  }
}
```

## AccessControl

```ts
export type AccessControl<
  TCollections extends Record<string, Awaited<ReturnType<Collection>>>,
  TAlgorithms extends Record<string, Awaited<ReturnType<Algorithm>>>
> = {
  roles?: Roles<TCollections, TAlgorithms>
  layers?: Partial<Record<ValidAccessControlLayer, AccessControlLayer<TCollections, TAlgorithms>>>
}
```

## AccessControlLayer

```ts
export type AccessControlLayer<
  TCollections extends Record<string, Awaited<ReturnType<Collection>>>,
  TAlgorithms extends Record<string, Awaited<ReturnType<Algorithm>>>
> = (context: Context<any, TCollections, TAlgorithms>, props: {
  propertyName?: string
  parentId?: string
  childId?: string
  payload: Record<string, any>

}) => Promise<void>
```

## ValidAccessControlLayer

```ts
export type ValidAccessControlLayer =
  'read'
  | 'write'
  | 'call'
```
