import type { Description } from '../types'
import type { mongoose } from 'mongoose'

import type { Config } from './types/config'


declare global {
  var descriptions: Record<string, Description>
  var modules: Record<string, any>
  var mongoose: typeof mongoose

  var PREBUNDLED_ASSETS: Record<string, any>
  type TesteConfig = {
    collections: {
      pet: {
        functions: {
          bark: (person: string) => string
        }
      }
    }
  }
}

