import { get, AccessControl } from '@semantic-api/api'

import person from './person'
import pet from './pet'

export const collections = {
  person,
  pet
} as const

export const accessControl: AccessControl<typeof collections> = {
  roles: {
    guest: {
      capabilities: {
        person: {
          functions: [
            'hello',
            'getAll'
          ]
        },
        pet: {
          functions: [
            'bark'
          ]
        }
      }
    }
  }
}

export const config = {
  collections,
} as const

// const c = defineConfig(config)
//

const main = async () => {

  const { bark } = await get('pet', 'functions')
  console.log(bark('joao'))

  // console.log(bark('joao'))
  //resource.functionsa.bark
  // const { bark } = await get('petx')

  // bark(1)
}

main()
