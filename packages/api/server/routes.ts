import { ServerRoute } from '@hapi/hapi'
import {
  safeHandle,
  safeHandleContext,
  regularVerb,
  customVerbs,
  fileDownload,
  fileInsert

} from './handler'

import type { ApiContext } from '../types'

export default (context: Partial<ApiContext>|null): Array<ServerRoute> => {
  const defaultHandler = (...args: Parameters<typeof safeHandle>) => {
    return safeHandleContext(args[0], context||{})
  }

  return [
    // {
    //   method: 'GET',
    //   path: '/api/{resourceName}/{id}',
    //   handler: defaultHandler(regularVerb('get'))
    // },
    {
      method: 'GET',
      path: '/api/{resourceName}',
      handler: defaultHandler(regularVerb('getAll'))
    },
    {
      method: 'POST',
      path: '/api/{resourceName}',
      handler: defaultHandler(regularVerb('insert'))
    },
    {
      method: 'PUT',
      path: '/api/{resourceName}/{id}',
      handler: defaultHandler(regularVerb('modify'))
    },
    {
      method: 'DELETE',
      path: '/api/{resourceName}/{id}',
      handler: defaultHandler(regularVerb('delete'))
    },
    {
      method: ['POST', 'GET'],
      path: '/api/{resourceName}/{functionName}',
      handler: defaultHandler(customVerbs('collection'))
    },
    {
      method: ['POST', 'GET'],
      path: '/api/_/{resourceName}/{functionName}',
      handler: defaultHandler(customVerbs('controllable'))
    },
    {
      method: 'GET',
      path: '/api/file/{hash}/{options*}',
      handler: defaultHandler(fileDownload)
    },
    {
      method: 'POST',
      path: '/api/file',
      handler: defaultHandler(fileInsert),
      options: {
        payload: {
          maxBytes: 2*(100*(1024**2))
        }
      }
    },
    {
      method: 'GET',
      path: '/{param}',
      handler: {
        directory: {
          path: `${process.cwd()}/public`,
          redirectToSlash: true,
          index: true
        }
      }
    },
    {
      method: 'GET',
      path: '/public/{param}',
      handler: {
        directory: {
          path: `${process.cwd()}/public`,
          redirectToSlash: true,
          index: true
        }
      }
    }
  ]
}
