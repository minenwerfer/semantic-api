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
