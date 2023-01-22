import type { Description as _Description } from '../../../types'
import type { SchemaProperties } from './schema.types'

type PropertyDependent =
  'filters'
    | 'table'
    | 'form'
    | 'writable'

export const makeDescription = <
  T extends _Description,
  A=SchemaProperties<T>,
  AvailableProperties=Array<keyof T['properties'] | 'owner'>,
  Description=Omit<_Description, keyof A | PropertyDependent> & {
    [P in PropertyDependent]?: AvailableProperties
  }
>(schema: A, description: Description = {} as Description): A & Description => ({
  ...schema,
  ...description
})
