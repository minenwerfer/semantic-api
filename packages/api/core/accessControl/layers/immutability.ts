import type { AccessControlLayer } from './types'
import * as R from 'ramda'

const internalCheck: (...args: Parameters<AccessControlLayer>) => Promise<void> = async (context, { propertyName: _propertyName, parentId, childId }) => {
  const { description } = context
  const propertyName = _propertyName || ''

  const property = description.properties[propertyName]
  if( !property ) {
    return
  }

  const immutable =  parentId && (
    description.immutable === true
    || (Array.isArray(description.immutable) && description.immutable.includes(propertyName) )
  )

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
    if( currentDocument[propertyName] && currentDocument[propertyName]?._id.toString() !== childId ) {
      throw new TypeError('incorrect child')
    }
  }

  const fulfilled = currentDocument[propertyName]
    && !R.isEmpty(currentDocument[propertyName])

  if( immutable && fulfilled ) {
    throw new TypeError(
      `target is immutable`
    )
  }
}

export const checkImmutability: AccessControlLayer = async (context, props) => {
  if( !props.parentId ) {
    return props.payload
  }

  if( props.payload ) {
    for( const propertyName of Object.keys(props.payload) ) {
      await internalCheck(context, {
        ...props,
        propertyName
      })
    }
  }

  await internalCheck(context, props)
  return props.payload
}
