export * from './core/assets'
export * from './core/collection'
export * from './core/exceptions'
export * from './core/accessControl/utils'
export * from './types'

declare global {
  var descriptions: Record<string, any>
  var modules: Array<any>
}
