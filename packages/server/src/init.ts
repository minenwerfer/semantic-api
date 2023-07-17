import Hapi from '@hapi/hapi'
import Inert from '@hapi/inert'

import type { ApiConfig } from './types'
import { createContext } from '@semantic-api/api'
import { connectDatabase } from '@semantic-api/api'
import { defaultApiConfig } from './constants'
import { warmup } from './warmup'
import getRoutes from './routes'

export const init = async (_apiConfig?: ApiConfig): Promise<Hapi.Server> => {
  const apiConfig: ApiConfig = {}
  Object.assign(apiConfig, defaultApiConfig)
  Object.assign(apiConfig, _apiConfig)

  const context = await createContext({
    apiConfig
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
