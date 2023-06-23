import type { Description } from '@semantic-api/types'
import type { SchemaProperties } from './schema.types'

type PropertyDependent =
  'filters'
  | 'table'
  | 'form'
  | 'writable'

type WithAvailableProps<
  Properties extends Description['properties'],
  TDescription extends Partial<Description>
> = Omit<TDescription, PropertyDependent> & Partial<Record<
  PropertyDependent & keyof TDescription,
  Array<keyof Properties
  | 'owner'
  | 'created_at'
  | 'updated_at'
  >>
>

export const defineDescription = <
  const TSchema extends WithAvailableProps<Description['properties'], SchemaProperties<Description>>,
  const TDescription extends WithAvailableProps<TSchema['properties'], Omit<Description, keyof TSchema>>
>(schema: TSchema, description?: TDescription): TSchema & TDescription => ({
  ...schema,
  ...description||{} as TDescription
})
