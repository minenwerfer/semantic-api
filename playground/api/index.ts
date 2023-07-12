import { initWithDatabase } from '@semantic-api/server'
import type { AccessControl } from '@semantic-api/access-control'

import person from './person'
import pet from './pet'
import algorithm from './algorithm'

export const collections = {
  person,
  pet
}

export const algorithms = {
  algorithm
}

export const accessControl: AccessControl<Collections, Algorithms> = {
  roles: {
    guest: {
      capabilities: {
        person: {
          functions: [
            'getAll'
          ]
        },
        algorithm: {
          functions: [
            'hello'
          ]
        }
      }
    }
  },
  layers: {
    write: async ({ resourceName }, { payload }) => {
      if( resourceName === 'person' ) {
        payload.what.name = `Modified: ${payload.what.name}`
      }
    }
  }
}

initWithDatabase().then(async (server) => {
  server.start()
})

