import { Types } from 'mongoose'
import { CollectionProperty } from '../../../types'

export const getTypeConstructor = (property: CollectionProperty): any => {
  if( property.type === 'array' ) {
    const type = getTypeConstructor(property.items!)
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
