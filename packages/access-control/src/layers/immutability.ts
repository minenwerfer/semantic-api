import type { AccessControlLayer } from './types'
import * as R from 'ramda'

const internalCheck: (...args: Parameters<AccessControlLayer>) => Promise<void> = async (context, { propertyName: _propertyName, parentId, childId, payload }) => {
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

  const currentDocument = await context.model.findOne({ _id: parentId }).lean()
  if( !currentDocument ) {
    throw new TypeError(
      `parent document not found`
    )
  }

  if( childId ) {
    if(
      (Array.isArray(currentDocument[propertyName]) && !currentDocument[propertyName].some((child: { _id: string }) => child?._id?.toString() === childId))
      || (!Array.isArray(currentDocument[propertyName]) && currentDocument[propertyName] && currentDocument[propertyName]?._id.toString() !== childId)
    ) {
      throw new TypeError('incorrect child')
    }
  }

  const fulfilled = currentDocument[propertyName]
    && !R.isEmpty(currentDocument[propertyName])

  if(
    immutable
    && fulfilled
    && (
      property.s$inline
        || currentDocument[propertyName]?._id.toString() !== payload[propertyName]
    )
  ) {
    throw new TypeError(
      `target is immutable`
    )
  }
}

export const checkImmutability: AccessControlLayer = async (context, props) => {
  if( !props.parentId ) {
    return
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
}
