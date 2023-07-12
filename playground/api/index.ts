import { initWithDatabase } from '@semantic-api/server'
import { useFunctions } from '@semantic-api/api'
import type { AccessControl } from '@semantic-api/access-control'

import person from './person'
import pet from './pet'
import algorithm from './algorithm'

const { getAll, insert } = useFunctions<any, any>()

export const collections = {
  person,
  pet,
  car: () => ({
    item: {},
    description: <const>{
      $id: 'car',
      strict: true,
      properties: {
        name: {
          type: 'string'
        },
        brand: {
          enum: [
            'vw',
            'fiat',
            'ford',
            'mercedes'
          ]
        }
      },
    },
    functions: {
      getAll,
      insert,
      test: async (_: null, context: Context<any>) => {
        await context.collection.functions.insert({
          what: {
            name: 'gol',
            brand: context.description.properties.brand.enum[Math.floor(Math.random()*context.description.properties.brand.enum.length)]
          }
        }, context)

        return context.collection.functions.getAll({}, context)
      }
    }
  })
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
        car: {
          grantEverything: true
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

