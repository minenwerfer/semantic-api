import type { ApiContext } from '@savitri/api'
import { init } from '@savitri/api/server'

const context: Partial<ApiContext> = {
  apiConfig: {
    roles: {
      guest: {
        capabilities: {
          person: {
            methods: [
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
