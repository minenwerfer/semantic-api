import type { ApiContext } from '@semantic-api/api'
import { init } from '@semantic-api/api/server'

const context: Partial<ApiContext> = {
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
