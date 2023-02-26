import { Types } from 'mongoose'
import { Description, CollectionProperty } from '../../../types'

export const getTypeConstructor = (property: CollectionProperty, recurse: (description: Pick<Description, 'properties'>) => any): any => {
  if( property.type === 'array' ) {
    const type = getTypeConstructor(property.items!, recurse)
    return [type]
  }

  if( property.$ref ) {
    return property.s$noId
      ? Object
      : Types.ObjectId
  }

  if( property.enum ) {
    const first = property.enum[0]
    return first?.constructor || String
  }

  if( property.additionalProperties ) {
    return [
      Map,
      getTypeConstructor(property.additionalProperties, recurse)
    ]
  }

  if( property.properties ) {
    return [
      Object,
      recurse(property as Parameters<typeof recurse>[0])
    ]
  }

  switch( property.format ) {
    case 'date':
    case 'date-time':
      return Date
  }

  switch( property.type ) {
    case 'string':
      return String
    case 'number':
    case 'integer':
      return Number
    case 'boolean':
      return Boolean
    case 'object':
      return Object
  }
}
