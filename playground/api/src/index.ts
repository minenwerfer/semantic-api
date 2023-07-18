import { initWithDatabase } from '@semantic-api/server'
import { defineAccessControl } from '@semantic-api/access-control'

import person from './collections/person'
import pet from './collections/pet'
import user from './collections/user'

import hello from './algorithms/hello'

export const collections = {
  person,
  pet,
  user
}

export const algorithms = {
  hello
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
        user: {
          functions: [
            'test',
          ]
        },
        hello: {
          functions: [
            'world'
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

