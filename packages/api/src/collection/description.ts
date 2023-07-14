import type { Description } from '@semantic-api/types'
import type { SchemaProperties } from './schema.types'

type PropertyDependent =
  'filters'
  | 'table'
  | 'form'
  | 'writable'

type WithAvailableProps<
  Properties extends Description['properties']|undefined,
  TDescription extends Partial<Description>
> = Omit<TDescription, PropertyDependent | 'properties'> & Partial<Record<
  PropertyDependent & keyof TDescription,
  ReadonlyArray<keyof Properties
  | 'owner'
  | 'created_at'
  | 'updated_at'
  >> & {
    properties: Description['properties']|undefined
 }
>

type SchemaStructure = Pick<Description,
  | '$id'
  | 'strict'
  | 'owned'
  | 'properties'
  | 'required'
  | 'indexes'
>

export const defineSchema = <const TSchema extends WithAvailableProps<Description['properties'], SchemaProperties<Description>>>(schema: TSchema) => schema

export const defineDescription = <
  const TSchema extends SchemaStructure,
  const TDescription extends WithAvailableProps<TSchema['properties'], Omit<Description, keyof TSchema>>
>(schema: TSchema, description?: TDescription): TSchema & TDescription => ({
  ...schema,
  ...description||{} as TDescription
})
