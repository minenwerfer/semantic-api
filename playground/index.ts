import { get, getFunction, getResourceAsset, ResourceErrors } from '@semantic-api/api'
import { isLeft, unwrapEither } from '@semantic-api/common'
// import { ACErrors } from '@semantic-api/access-control'
import { initWithDatabase as init } from '@semantic-api/server'

init().then((server) => {
  server.start()
})

import person from './person'
import pet from './pet'

export const collections = {
  person,
  pet
}

// export const accessControl = {
//   roles: {
//     base: {
//       capabilities: {
//         pet: {
//           functions: [
//             'bark'
//           ]
//         }
//       }
//     },
//     barker: {
//       inherit: [
//         'base'
//       ]
//     },
//     guest: {
//       capabilities: {
//         person: {
//           functions: [
//             'hello',
//             'getAll'
//           ]
//         },
//       }
//     },
//     root: {
//       inherit: [
//         'barker'
//       ]
//     }
//   }
// }

// export const config = {
//   collections,
//   accessControl
// }

// const main = async () => {
//   const description = await get('pet', 'description')
//   console.log(description.properties.favorite_toy)

//   const barkEither = await getFunction('pet', 'bark', {
//     roles: [
//       'root'
//     ]
//   })

//   if( isLeft(barkEither) ) {
//     const error = unwrapEither(barkEither)
//     switch( error ) {
//       case ACErrors.AuthorizationError: console.log('Erro de autorização')
//     }

//     return
//   }

//   const bark = unwrapEither(barkEither)
//   bark('joao')
// }

// main()
