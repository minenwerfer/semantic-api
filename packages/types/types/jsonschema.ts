import { PROPERTY_TYPES, PROPERTY_FORMATS } from '../constants'

export type PropertyType = typeof PROPERTY_TYPES[number]
export type PropertyFormat = typeof PROPERTY_FORMATS[number]

export type JsonSchema = {
  $id: string
  required?: ReadonlyArray<string>
  presets?: ReadonlyArray<string>
  properties: Record<string, Property>
}

export type RefType = {
  $ref: string
}

export type EnumType = {
  enum: ReadonlyArray<any>
}

export type PrimitiveType = {
  type: PropertyType
}

export type PropertyAux =
  { [P in keyof RefType]?: RefType[P] } &
  { [P in keyof EnumType]?: EnumType[P] } &
  { [P in keyof PrimitiveType]?: PrimitiveType[P] }

export type Property = (RefType | EnumType | PrimitiveType) & PropertyAux &  {
  format?: PropertyFormat

  default?: any
  description?: string
  items?: Property

  readOnly?: boolean
  uniqueItems?: boolean

  minimum?: number
  maximum?: number
  exclusiveMinimum?: number
  exclusiveMaximum?: number

  minItems?: number
  maxItems?: number

  minLength?: number
  maxLength?: number
}
