import type { ApiContext } from '@semantic-api/api'
import { init } from '@semantic-api/api/server'

import person from './collections/person'

const context: Partial<ApiContext> = {
  collections: {
    person
  },
  accessControl: {
    roles: {
      guest: {
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

init({ context }).then(server => {
  server.start()
})
