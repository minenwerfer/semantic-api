import { initWithDatabase } from '@semantic-api/server'

import person from './person'
import pet from './pet'

export const collections = {
  person,
  pet
}

export const accessControl = {
  roles: {
    guest: {
      capabilities: {
        person: {
          functions: [
            'getAll'
          ]
        }
      }
    }
  }
}

initWithDatabase().then(async (server) => {
  server.start()
})

