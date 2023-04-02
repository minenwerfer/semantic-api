import type { Description } from '../types'
import type { mongoose } from 'mongoose'

declare global {
  var descriptions: Record<string, Description>
  var modules: Record<string, any>
  var mongoose: typeof mongoose

  var PREBUNDLED_ASSETS: Record<string, any>
}
