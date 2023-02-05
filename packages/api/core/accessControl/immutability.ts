import * as R from 'ramda'
import type { ApiContext } from '../..'

const internalCheck = async (
  context: ApiContext,
  propertyName: string,
  parentId: string,
  childId?: string
) => {
  const { description } = context
  const property = description.properties[propertyName]
  if( !property ) {
    return
  }

  if( parentId && (
    description.immutable === true
    || (Array.isArray(description.immutable) && description.immutable.includes(propertyName) ))
  ) {
    throw new TypeError(
      `tried to perform insert on immutable resource`
    )
  }

  const currentDocument = await context.resource.get({
    filters: {
      _id: parentId
    }
  })

  if( !currentDocument ) {
    throw new TypeError(
      `parent document not found`
    )
  }

  if( childId ) {
    if( currentDocument[propertyName]?._id.toString() !== childId ) {
      throw new TypeError('incorrect child')
    }
  }

  const fulfilled = currentDocument[propertyName]
    && !R.isEmpty(currentDocument[propertyName])

  if( fulfilled ) {
    throw new TypeError(
      `target is immutable`
    )
  }

  return property
}

export const checkImmutability = async (
  context: ApiContext,
  propertyName: string,
  parentId: string,
  childId?: string
) => {
  const property = await internalCheck(
    context,
    propertyName,
    parentId,
    childId
  )

  if( !property ) {
    return
  }
}
