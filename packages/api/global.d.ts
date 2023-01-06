import type { MaybeDescription } from '../types'

declare global {
  var descriptions: Record<string, MaybeDescription>
  var modules: Record<string, any>
}
