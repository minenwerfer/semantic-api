import { get, getFunction, getResourceAsset, ResourceErrors } from '@semantic-api/api'
import { isLeft, unwrapEither } from '@semantic-api/common'
// import { ACErrors } from '@semantic-api/access-control'
import { initWithDatabase as init } from '@semantic-api/server'

import person from './person'
import pet from './pet'

export const collections = {
  person,
  pet
}

init().then(async (server) => {
  server.start()

  // const either = await getFunction('person', 'getAll')
  // if( isLeft(either) ) {
  //   const error = unwrapEither(either)
  //   switch( error ) {
  //     case ResourceErrors.ResourceNotFound: throw new Error('resource not found')
  //     default: throw new Error('unhandled exception')
  //   }
  // }

  // const func = unwrapEither(either)
  // func({
  //   filters: {
  //     name: 'string'
  //   }
  // })
})


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
