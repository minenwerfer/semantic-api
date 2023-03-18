import * as R from 'ramda'
import { getReferencedCollection, serialize } from '@semantic-api/common'
import { getResourceAsset } from '../assets'
import type { Description } from '../../../types'

export type PreloadOptions = {
  serialize?: boolean
}

export const applyPreset = (entry: Description | Description['properties'], presetName:string, parentName?:string) => {
  const preset = require(`${__dirname}/../../presets/${presetName}`)
  const presetObject = Object.assign({}, parentName ? (preset[parentName]||{}) : preset)

  return R.mergeDeepWith(
    (l, r) => R.is(Object, l) && R.is(Object, r)
      ? R.concat(l, r)
      : l,
    entry,
    presetObject
  )
}

export const preloadDescription = <Options extends PreloadOptions, Return=Options extends { serialize: true }
  ? Buffer
  : Description
>(description: Description, options?: Options) => {
  if( description.alias ) {
    const _aliasedCollection = getResourceAsset(description.alias, 'description')

    const {
      $id: collectionName,
      strict,
      ...aliasedCollection

    } = _aliasedCollection

    const temp = Object.assign(aliasedCollection, description)
    Object.assign(description, temp)
  }

  const presets = description.presets?.slice() || []
  if( description.owned ) {
    presets.push('owned')
  }

  if( presets.length > 0 ) {
    const merge = presets?.reduce(
      (a, presetName: string) => applyPreset(a, presetName),
      description as Description
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
          const referenceDescription = getResourceAsset(reference.$ref!, 'description')
          const indexes = property.s$indexes = referenceDescription.indexes?.slice()

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

  return (options?.serialize
    ? serialize(description)
    : description) as Return
}
