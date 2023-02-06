import { checkOwnership } from './ownership'
import { checkImmutability } from './immutability'
export * from './types'

export {
  checkOwnership,
  checkImmutability
}

export default [
  checkOwnership,
  checkImmutability
]
