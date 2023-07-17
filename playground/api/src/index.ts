import { initWithDatabase } from '@semantic-api/server'
import { defineAccessControl } from '@semantic-api/access-control'

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

export const accessControl = defineAccessControl<Collections, Algorithms>()({
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
  }   
})({
  write: async (context, { payload }) => {
    const {
      resourceName,
      token
    } = context

    if( resourceName === 'person' && token.user.roles.includes('guest') ) {
      payload.what.name = `Modified: ${payload.what.name}`
    }
  }
})

initWithDatabase().then(async (server) => {
  server.start()
})

