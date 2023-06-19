import type { Description } from '@semantic-api/types'
import type { SchemaProperties } from './schema.types'

type PropertyDependent =
  'filters'
    | 'table'
    | 'form'
    | 'writable'

export const defineDescription = <
  T extends Description,
  A=SchemaProperties<T>,
  AvailableProperties=Array<
    keyof T['properties']
    | 'owner'
    | 'created_at'
    | 'updated_at'
  >,
  TDescription=Omit<Description, keyof A | PropertyDependent> & {
    [P in PropertyDependent]?: AvailableProperties
  }
>(schema: A, description?: TDescription): A & TDescription => ({
  ...schema,
  ...description||{} as TDescription
})
