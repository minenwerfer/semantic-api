# @semantic-api/server

## Types

- [`ApiConfig`](#api-config)

## Global API

- [`init`](#init)
- [`initThenStart`]()
- [`initWithDatabase`]()
- [`initWithDatabaseThenStart`]()

## ApiConfig

```ts
export type ApiConfig = {
  port?: number
  group?: string

  allowSignup?: boolean
  signupDefaults?: {
    roles: Array<string>
    active: boolean
  }

  populateUserExtra?: Array<string>
}
```

## init

Setups a HTTP server that will put the API running. This function receives an [`ApiConfig`](#api-config) as an optional parameter and resolves an [`Hapi.Server`](https://hapi.dev/api/?v=21.3.2#server) object.

```ts
export const init = async (_apiConfig?: ApiConfig): Promise<Hapi.Server>
```

## initThenStart <Badge type="info" text="shorthand" />

This shorthand function will setup the HTTP server and start it immediately.

```ts
export const initThenStart = async (...args: Parameters<typeof init>) => {
  const server = await init(...args)
  server.start()
}
```

## initWithDatabase <Badge type="info" text="shorthand" />

This shorthand function will setup the HTTP server and call [`connectToDatabase`](/api/connect-to-database) immediately.

```ts
export const initWithDatabase = async (...args: Parameters<typeof init>) => {
  await connectDatabase()
  return init(...args)
}

```

## initWithDatabaseThenStart <Badge type="info" text="shorthand" />

This shorthand function will setup the HTTP server and connect to the database and start immediately.

```ts
export const initWithDatabaseThenStart = async (...args: Parameters<typeof init>) => {
  const server = await initWithDatabase(...args)
  server.start()
}
```
