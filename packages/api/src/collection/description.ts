import type { Description } from '@semantic-api/types'
import type { Schema } from './schema.types'

type PropertyDependent =
  'filters'
  | 'table'
  | 'form'
  | 'writable'
  | 'required'
  | 'indexes'

type SchemaProps = 
  | '$id'
  | 'owned'
  | 'required'
  | 'indexes'
  | 'properties'

export const defineDescription = <const TDescription extends Omit<Description, PropertyDependent | SchemaProps> & Record<
  Exclude<PropertyDependent & keyof TDescription, SchemaProps>,
  'properties' extends keyof TDescription
    ? Array<keyof TDescription['properties']>
    : never
> & {
  [P in Exclude<SchemaProps, 'properties'>]: TDescription[P] extends NonNullable<Description[P]>
    ? P extends PropertyDependent
      ? TDescription[P] & Array<keyof TDescription['properties']>
      : TDescription[P]
    : Description[P]
} & {
  properties: TDescription['properties'] extends Description['properties']
    ? TDescription['properties']
    : Description['properties']

}>(description: Partial<TDescription>) => [{}, description] as unknown as [
  Schema<TDescription>,
  TDescription
]

export const defineAliasDescription = <TDescription extends Partial<Description>>(description: TDescription) => {
  description.properties ??= {}
  return defineDescription(description as any)[1] as TDescription & {
    properties: TDescription['properties'] extends object
      ? TDescription['properties']
      : {}
  }
}
