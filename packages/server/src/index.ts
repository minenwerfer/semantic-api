import Hapi from '@hapi/hapi'
import Inert from '@hapi/inert'

import type { ApiContext } from '../types'
import { connectDatabase } from '../core/database'
import warmup from '../core/warmup'
import getRoutes from './routes'
export { getToken } from './handler'

const defaultApiConfig = {
  port: 3000,
  modules: [],
  descriptions: {},
}

const defaultAccessControl = {
  roles: {
    guest: {
      grantEverything: true
    }
  }
}

export const init = async (_context?: Partial<ApiContext>|null): Promise<Hapi.Server> => {
  const apiConfig = Object.assign({}, defaultApiConfig)
  const accessControl = Object.assign({}, defaultAccessControl)

  Object.assign(apiConfig, _context?.apiConfig||{})
  Object.assign(accessControl, _context?.accessControl||{})

  const context = Object.assign(_context||{}, {
    apiConfig,
    accessControl,
  }) as ApiContext

  console.time('warmup')
  await warmup(context)
    .then(() => console.timeEnd('warmup'))

  if( apiConfig.modules ) {
    global.modules = apiConfig.modules
  }

  if( context?.descriptions ) {
    Object.assign(global.descriptions, context.descriptions)
  }

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
