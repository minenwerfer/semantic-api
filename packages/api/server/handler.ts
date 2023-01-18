import './bootstrap'

import * as R from 'ramda'
import { getResourceFunction } from '../core/assets'
import type { Request, ResponseToolkit } from '@hapi/hapi'
import type {
  HandlerRequest,
  DecodedToken,
  ApiContext,
  ResourceType,
  FunctionPath

} from '../types'

import { Error as MongooseError } from 'mongoose'
import { TokenService } from '../core/token'
import { makeException } from '../core/exceptions'
import { checkAC, sanitizeRequest, prependPagination } from './hooks/pre'
import { processRedirects, appendPagination } from './hooks/post'

export type RegularVerb =
  'get'
  | 'getAll'
  | 'insert'
  | 'modify'
  | 'delete'
  | 'deleteAll'

const prePipe = R.pipe(
  checkAC,
  sanitizeRequest,
  prependPagination
)

const postPipe = R.pipe(
  processRedirects,
  appendPagination
)

const fallbackContext = {
  apiConfig: {},
  injected: {},
  collection: {}

} as ApiContext

export const getToken = async (request: Request) => {
  try {
    return request.headers.authorization
      ? TokenService.decode(request.headers.authorization.split('Bearer ').pop() || '')
      : {} as object
  } catch( e: any ) {
    throw makeException({
      name: 'AuthenticationError',
      message: e.message,
      logout: true
    })
  }
}

export const safeHandle = (
  fn: (request: HandlerRequest, h: ResponseToolkit) => any|Promise<any>
) => async (request: HandlerRequest, h: ResponseToolkit) => {
  try {
    const response = await fn(request, h)
    if( !response ) {
      throw new Error('empty response')
    }

    return response

  } catch(error: any) {
    if( process.env.NODE_ENV !== 'production' ) {
      console.trace(error)
    }

    const response: { error: any, validation?: any } = {
      error: {
        name: error.name,
        code: error.code,
        message: error.message,
        details: error.details,
        silent: error.silent,
        logout: error.logout,
      }
    }

    if( error instanceof MongooseError.ValidationError ) {
      const errors = Object.values(error.errors)
      response.error.silent = true
      response.error.validation = errors.reduce((a, error: any) => {
        return {
          ...a,
          [error.path]: {
            type: error.kind,
            detail: null
          },
        }
      }, {})
    }

    return response
  }
}

export const safeHandleContext = (
  fn: (request: HandlerRequest, h: ResponseToolkit, context: ApiContext) => object,
  _context?: Partial<ApiContext>
) => {
  const fc = Object.assign({}, fallbackContext)
  const context = Object.assign(fc, _context)

  const fn2 = (r: HandlerRequest, h: ResponseToolkit) => fn(r, h, context)
  return safeHandle(fn2)
}

export const customVerbs = (resourceType: ResourceType) =>
  async (
  request: HandlerRequest,
  h: ResponseToolkit,
  _context?: ApiContext
) => {
  const {
    params: {
      resourceName,
      functionName
    }
  } = request

  const functionPath: FunctionPath = `${resourceName}@${functionName}`

  const token = await getToken(request) as DecodedToken
  const context = _context||fallbackContext
  context.token = token
  context.resourceName = resourceName
  context.response = h

  prePipe({
    request,
    token,
    response: h,
    functionPath,
    context
  })

  const result = await getResourceFunction(functionPath, resourceType)(request.payload, context)
  return postPipe({
    request,
    result,
    context,
    resourceName,
    resourceType
  })
}

export const regularVerb = (functionName: RegularVerb) =>
  async (
    request: HandlerRequest,
    h: ResponseToolkit,
    _context?: ApiContext
) => {
  const {
    params: {
      resourceName,
      id
    }
  } = request

  const functionPath: FunctionPath = `${resourceName}@${functionName}`

  const token = await getToken(request) as DecodedToken
  const context = _context||fallbackContext
  context.resourceName = resourceName
  context.token = token

  prePipe({
    request,
    token,
    response: h,
    functionPath,
    context
  })

  const requestCopy = Object.assign({}, request)
  requestCopy.payload ||= {}

  if( id ) {
    requestCopy.payload.filters = {
      ...requestCopy.payload.filters||{},
      _id: id
    }

    if( 'what' in requestCopy.payload ) {
      requestCopy.payload.what._id = id
    }
  }

  const result = await getResourceFunction(functionPath)(request.payload, context)
  return postPipe({
    request,
    result,
    context,
    resourceName,
    resourceType: 'collection'
  })
}

export const fileDownload = async (
  request: HandlerRequest,
  h: ResponseToolkit,
  _context?: ApiContext
) => {
  const token = await getToken(request) as DecodedToken
  const context = _context||fallbackContext
  context.token = token

  const { hash, options } = request.params
  const { filename, content, mime } = await getResourceFunction('file@download')(hash, context)

  const parsedOptions = (options||'').split(',')
  const has = (opt: string) => parsedOptions.includes(opt)

  return h.response(content)
    .header('Content-Type', mime)
    .header('Content-Disposition', `${has('download') ? 'attachment; ' : ''}filename=${filename}`)
}

export const fileInsert = async (
  request: HandlerRequest,
  _h: ResponseToolkit,
  _context?: ApiContext
) => {
  const token = await getToken(request) as DecodedToken
  const context = _context||fallbackContext
  context.token = token

  const result = await getResourceFunction('file@insert')(request.payload, context)

  return { result }
}
