import { Description } from '@semantic-api/types'
// import type { ApiContext } from './function'
import type { AccessControl } from './accessControl'
import type { CollectionFunctions } from '../core/collection/functions.types'
import type { createModel } from '../core/collection/schema'

export type Collection = {
  description: Description
  model?: ReturnType<typeof createModel>
  functions?: Record<string, (...args: any[]) => any>
  fallbackFunctions?: ReadonlyArray<keyof CollectionFunctions>
}

export type Collections = Record<string, Collection>

export type Config<_Collections extends Collections> = {
  collections: Collections
  accessControl: AccessControl<_Collections>
}

const collections = <const>{
  person: {
    description: {
      $id: 'person',
      properties: {
        age: {
          type: 'number'
        }
      }
    },
    functions: {
      hello: () => 'oi'
    },
    fallbackFunctions: [
      'get',
      'getAll'
    ]
  }
}

export const config: Config<typeof collections> = {
  collections,
  accessControl: {
    roles: {
      root: {
        capabilities: {
          person: {
            functions: [
              'hello',
              'get',
              'getAll'
            ]
          }
        }
      }
    }
  }
}

const b: Partial<TesteConfig> = {
  accessControl: {
    roles: {
      root: {
        capabilities: {
          person: {
            functions: [
              'hello'
            ]
          }
        }
      }
    }
  }
}
