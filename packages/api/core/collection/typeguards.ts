import type {
  MaybeDescription,
  MaybeCollectionAction,
  CollectionProperty,
  PropertyType,
  CollectionPresets,
  StoreEffect

} from '../../../types'

import {
  PROPERTY_TYPES,
  COLLECTION_PRESETS,
  STORE_EFFECTS

} from '../../../types/constants'

export const presets = (description: MaybeDescription): MaybeDescription => {
  const isValidPresets = (preset?: string): preset is CollectionPresets => {
    return COLLECTION_PRESETS.includes(preset as CollectionPresets)
  }

  description.presets?.forEach((preset: string) => {
    if( !isValidPresets(preset) ) {
      throw TypeError(
        `invalid preset "${preset}" at "${(description as MaybeDescription).$id}"`
      )
    }
  })

  return description
}
export const properties = (description: MaybeDescription): MaybeDescription => {
  const isValidPropertyType = (propertyType?: string): propertyType is PropertyType => {
    return PROPERTY_TYPES.includes(propertyType as PropertyType)
  }

  Object.entries(description?.properties||{}).forEach(([propertyName, _property]) => {
    const property = _property as Pick<CollectionProperty, 'type' | '$ref' | 'enum'>
    if( property.type && !isValidPropertyType(property.type) ) {
      throw TypeError(
        `invalid property type "${property.type}" at "${(description as MaybeDescription).$id}.${propertyName}"`
      )
    }
  })

  return description
}

export const actions = (description: MaybeDescription): MaybeDescription => {
  const isValidStoreEffect = (effectName?: string): effectName is StoreEffect => {
    return Object.keys(STORE_EFFECTS).includes(effectName as StoreEffect)
  }

  const checkActions = ([actionName, action]: [string, MaybeCollectionAction|null]) => {
    if( action === null ) {
      return
    }

    if( action.effect && !isValidStoreEffect(action.effect) ) {
      throw TypeError(
        `invalid action effect "${action.effect}" at "${actionName}@${(description as MaybeDescription).$id}"`
      )
    }
  }

  Object.entries(description?.actions||{}).forEach(checkActions)
  Object.entries(description?.individualActions||{}).forEach(checkActions)

  return description
}
