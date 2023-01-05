import * as R from 'ramda'
import { getReferencedCollection } from '../../../common'
import { getEntityAsset } from '../assets'
import type { MaybeDescription, Description } from '../../../types'

export const applyPreset = (description: MaybeDescription, presetName:string, parentName?:string) => {
  const preset = require(`${__dirname}/../../presets/${presetName}`)
  const presetObject = Object.assign({}, parentName ? (preset[parentName]||{}) : preset)

  return R.mergeDeepWith(
    (l, r) => R.is(Object, l) && R.is(Object, r)
      ? R.concat(l, r)
      : l,
    description,
    presetObject
  )
}

export const preloadDescription = (description: MaybeDescription) => {
  if( description.alias ) {
    const _aliasedCollection = getEntityAsset(description.alias, 'description')

    const {
      $id: collectionName,
      strict,
      ...aliasedCollection

    } = _aliasedCollection

    const temp = Object.assign(aliasedCollection, description)
    Object.assign(description, temp)
  }

  const presets = (description as {
    -readonly [P in keyof Description]: Description[P]
  }).presets || []

  if( description.owned ) {
    presets.push('owned')
  }

  if( presets.length > 0 ) {
    const merge = presets?.reduce(
      (a, presetName: string) => applyPreset(a, presetName),
      description as MaybeDescription
    )

    Object.assign(description, merge)
  }

  if( description.properties ) {
    description.properties = Object.entries(description.properties).reduce((a, [key, _property]) => {
      const property = Object.assign({}, _property)
      const reference = getReferencedCollection(property)

      if( reference ) {
        property.s$isReference = true
        property.s$isFile = reference.$ref === 'file'
        property.s$referencedCollection = reference.$ref

        if( !property.s$indexes && !property.s$inline ) {
          const referenceDescription = getEntityAsset(reference.$ref!, 'description')
          const indexes = property.s$indexes = referenceDescription.indexes

          if( !indexes ) {
            throw new Error(
              `neither s$indexes or s$inline are present on reference property or indexes is set on target description on ${description.$id}.${key}`
            )
          }
        }
      }

      return {
        ...a,
        [key]: property
      }
    }, {})
  }

  return description as Description
}
