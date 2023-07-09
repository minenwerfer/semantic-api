import * as R from 'ramda'
import { createContext, getFunction, Token, makeException } from '@semantic-api/api'
import { isLeft, unwrapEither } from '@semantic-api/common'
import type { Request, ResponseToolkit } from '@hapi/hapi'
import type { HandlerRequest } from './types'
import type { DecodedToken, Context, ResourceType, } from '@semantic-api/api'

import { Error as MongooseError } from 'mongoose'
import { sanitizeRequest, prependPagination } from './hooks/pre'
import { appendPagination } from './hooks/post'

export type RegularVerb =
  'get'
  | 'getAll'
  | 'insert'
  | 'modify'
  | 'delete'
  | 'deleteAll'
  | 'upload'

const prePipe = R.pipeWith(R.andThen)([
  sanitizeRequest,
  prependPagination
])

const postPipe = R.pipeWith(R.andThen)([
  appendPagination
])

export const getToken = async (request: Request) => {
  try {
    return request.headers.authorization
      ? Token.decode(request.headers.authorization.split('Bearer ').pop() || '')
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
        httpCode: error.httpCode
      }
    }

    if( error instanceof MongooseError.ValidationError ) {
      const errors = Object.values(error.errors)
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

    if( request.headers['sec-fetch-mode'] === 'cors' ) {
      return response
    }

    error.httpCode ??= 500
    return h.response(response).code(error.httpCode)
  }
}

export const safeHandleContext = (
  fn: (request: HandlerRequest, h: ResponseToolkit, context: Context<any, any, any>) => object,
  context: Context<any, any, any>
) => {
  const fn2 = (r: HandlerRequest, h: ResponseToolkit) => fn(r, h, context)
  return safeHandle(fn2)
}

export const customVerbs = (resourceType: ResourceType) =>
  async (
  request: HandlerRequest,
  h: ResponseToolkit,
  parentContext: Context<any, any, any>
) => {
  const {
    params: {
      resourceName,
      functionName
    }
  } = request


  const token = await getToken(request) as DecodedToken
  const context = await createContext({
    parentContext,
    resourceType,
    resourceName
  })

  Object.assign(context, {
    token,
    resourceName,
    h,
    request
  })

  await Promise.all([
    prePipe({
      request,
      token,
      response: h,
      context
    })
  ])

  const fnEither = await getFunction(resourceName, functionName, null, `${resourceType}s`)
  if( isLeft(fnEither) ) {
    throw new Error('no such function')
  }

  const fn = unwrapEither(fnEither)
  const result = await fn(request.payload, context)

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
    parentContext: Context<any, any, any>
) => {
  const {
    params: {
      resourceName,
      id
    }
  } = request

  const token = await getToken(request) as DecodedToken
  const context = await createContext({
    parentContext,
    resourceName
  })

  Object.assign(context, {
    token,
    resourceName,
    h,
    request
  })

  await Promise.all([
    prePipe({
      request,
      token,
      response: h,
      context
    })
  ])

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

  const fnEither = await getFunction(resourceName, functionName)
  if( isLeft(fnEither) ) {
    const error = unwrapEither(fnEither)
    return {
      error
    }
  }

  const fn = unwrapEither(fnEither)
  const result = await fn(request.payload, context)

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
  context: Context<any, any, any>
) => {
  const token = await getToken(request) as DecodedToken
  context.token = token

  // const { hash, options } = request.params
  // const { filename, content, mime } = await getResourceFunction('file@download')(hash, context)

  // const has = (opt: string) => options?.split('/').includes(opt)

  // return h.response(mime)
  //   .header('content-type', content)
  //   .header('content-disposition', `${has('download') ? 'attachment; ' : ''}filename=${filename}`)
}
