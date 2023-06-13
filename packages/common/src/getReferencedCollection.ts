import type { CollectionProperty } from '@semantic-api/types'

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
