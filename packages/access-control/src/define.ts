import type { Collection, Algorithm } from '@semantic-api/api'
import type { AccessControl } from './types'
import { baseRoles } from './baseRoles'

// export const defineAccessControl = <
//   TCollections extends Record<string, Awaited<ReturnType<Collection>>>,
//   TAlgorithms extends Record<string, Awaited<ReturnType<Algorithm>>>
// >() => <const TAccessControl extends AccessControl<TCollections, TAlgorithms, TAccessControl>>(accessControl: TAccessControl) => {
//   return {
//     ...baseRoles,
//     accessControl
//   }
// }

// const accessControl = defineAccessControl<any, any>()({
//   kkk: 'oi',
//   roles: {
//     guest: {
//       // inherit: [
//       //   'authenticated'
//       // ],
//       capabilities: {
//         checkout: {
//           functions: [
//             'render'
//           ]
//         }
//       }
//     },
//     root: {
//       grantEverything: true,
//     },
//     // customer: {
//     //   grantEverything: true,
//     //   capabilities: {
//     //     user: {
//     //       blacklist: [
//     //         'getAllx'
//     //       ]
//     //     }
//     //   }
//     // }
//   },
//   layers: {
//     write: async ({ resourceName, log }, { payload }) => {
//       if( resourceName !== 'log' ) {
//         log('user performed insert', payload?.what)
//       }
//     }
//   }
// })
