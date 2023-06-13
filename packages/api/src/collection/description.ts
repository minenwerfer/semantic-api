import type { Description as _Description } from '../../../types'
import type { SchemaProperties } from './schema.types'

type PropertyDependent =
  'filters'
    | 'table'
    | 'form'
    | 'writable'

export const defineDescription = <
  T extends _Description,
  A=SchemaProperties<T>,
  AvailableProperties=Array<
    keyof T['properties']
    | 'owner'
    | 'created_at'
    | 'updated_at'
  >,
  Description=Omit<_Description, keyof A | PropertyDependent> & {
    [P in PropertyDependent]?: AvailableProperties
  }
>(schema: A, description?: Description): A & Description => ({
  ...schema,
  ...description||{} as Description
})
