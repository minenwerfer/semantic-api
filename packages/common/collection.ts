import type { Description, CollectionProperty } from '../types'

export const getReferencedCollection = (property?: CollectionProperty) => {
  const search = [
    property?.items,
    property?.additionalProperties,
    property
  ]

  const reference = search.find((_) => !!_)
  return reference?.$ref
    ? { ...property, ...reference }
    : null
}

export function getIndexes(
  description: Pick<Description, 'properties'>,
  key: string
) {
  const property = description.properties?.[key]
  const { $ref, s$indexes } = getReferencedCollection(property)||{}

  if( !$ref || !s$indexes ) {
    return []
  }

  return s$indexes
}

export const getFirstValue = (
  description: Pick<Description, 'properties'>,
  value: any,
  key: string
) => {
  if( !value ) {
    return '-'
  }

  const firstIndex = (() => {
    const indexes = getIndexes(description,  key)
    if( indexes.length > 0 ) {
      return indexes
    }

    return Array.isArray(value)
      ? Object.keys(value[0]||{})
      : Object.keys(value)

  })()[0]

  if( Array.isArray(value) ) {
    return value.map((v: any) => {
      return v && typeof v === 'object'
        ? v[firstIndex]
        : v

    }).join(', ')
  }

  return value[firstIndex]
}

export const formatValue = (
  description: Pick<Description, 'properties'>,
  value: any,
  key: string,
  property?: CollectionProperty
): string => {
  const firstValue = value && typeof value === 'object' && !(value instanceof Date)
    ? ((Array.isArray(value) || value?._id) ? getFirstValue(description, value, key) : Object.values(value)[0])
    : value

  const formatted = (() => {
    switch(true) {
      case ['date', 'date-time'].includes(property?.format!):
        return String(firstValue).formatDateTime(property?.format === 'date-time')

      case property?.type === 'boolean': return firstValue ? 'true' : 'false'
      case [undefined, null].includes(firstValue): return '-'
      default: return firstValue
    }
  })()

  return String(formatted)
}
