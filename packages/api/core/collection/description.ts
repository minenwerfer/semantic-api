import type { MaybeDescription } from '../../../types'
import type { SchemaProperties } from './schema.types'

export const makeDescription = <
  T,
  A=SchemaProperties<T>,
  Description=Omit<MaybeDescription, keyof A>
>(schema: A, description: Description = {} as Description): A & Description => ({
  ...schema,
  ...description
})
