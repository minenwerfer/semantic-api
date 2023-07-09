import Hapi from '@hapi/hapi'
import Inert from '@hapi/inert'

import { createContext, type Config, type Collection, type Algorithm } from '@semantic-api/api'
import { connectDatabase } from '@semantic-api/api'
import { defaultApiConfig, defaultAccessControl } from './constants'
import { warmup } from './warmup'
import getRoutes from './routes'

export const init = async <
  TCollections extends Record<string, Collection>,
  TAlgorithms extends Record<string, Algorithm>
>(_config?: Config<TCollections, TAlgorithms>): Promise<Hapi.Server> => {
  const config = _config || {} as unknown as NonNullable<typeof _config>
  const apiConfig = Object.assign({}, defaultApiConfig)
  const accessControl = Object.assign({}, defaultAccessControl)

  Object.assign(apiConfig, config?.apiConfig||{})
  Object.assign(accessControl, config?.accessControl||{})

  Object.assign(config, {
    apiConfig,
    accessControl
  })

  const context = await createContext({
    config
  })

  Object.assign(context, {
    apiConfig,
    accessControl
  })

  console.time('warmup')
  await warmup(context)
    .then(() => console.timeEnd('warmup'))

  const server = Hapi.server({
    port: apiConfig.port,
    host: '0.0.0.0',
    routes: {
      cors: {
        origin: ['*'],
        headers: [
          'Accept', 
          'Accept-Version',
          'Authorization', 
          'Content-Length', 
          'Content-MD5', 
          'Content-Type', 
          'Date', 
          'X-Api-Version'
        ]
      }
    }
  })

  await server.register(Inert as any)

  const routes = getRoutes(context)
  for( const route of routes ) {
    server.route(route)
  }

  return server
}

export const initWithDatabase = async (...args: Parameters<typeof init>) => {
  await connectDatabase()
  return init(...args)
}

export const initThenStart = async (...args: Parameters<typeof init>) => {
  const server = await init(...args)
  server.start()
}

export const initWithDatabaseThenStart = async (...args: Parameters<typeof init>) => {
  const server = await initWithDatabase(...args)
  server.start()
}
