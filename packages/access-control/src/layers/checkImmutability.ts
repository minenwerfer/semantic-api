import type { AccessControlLayerProps, ReadPayload, WritePayload } from './types'
import type { Context } from '@semantic-api/api'
import { left, right, isLeft } from '@semantic-api/common'
import * as R from 'ramda'
import { ACErrors } from '../errors'

const internalCheck = async (context: Context<any, any, any>, props: AccessControlLayerProps<ReadPayload|WritePayload>) => {
  const {
    propertyName = '',
    parentId,
    childId,
    payload

  } = props

  const { description } = context
  const source = 'what' in props.payload
    ? props.payload.what
    : props.payload.filters

  const property = description.properties[propertyName]
  if( !property ) {
    return right(props.payload)
  }

  const immutable =  parentId && (
    description.immutable === true
    || (Array.isArray(description.immutable) && description.immutable.includes(propertyName) )
  )

  const currentDocument = await context.model.findOne({ _id: parentId }).lean()
  if( !currentDocument ) {
    return left(ACErrors.ImmutabilityParentNotFound)
  }

  if( childId ) {
    if(
      (Array.isArray(currentDocument[propertyName]) && !currentDocument[propertyName].some((child: { _id: string }) => child?._id?.toString() === childId))
      || (!Array.isArray(currentDocument[propertyName]) && currentDocument[propertyName] && currentDocument[propertyName]?._id.toString() !== childId)
    ) {
      return left(ACErrors.ImmutabilityIncorrectChild)
    }
  }

  const fulfilled = currentDocument[propertyName]
    && !R.isEmpty(currentDocument[propertyName])

  if(
    immutable
    && fulfilled
    && (
      property.s$inline
        || currentDocument[propertyName]?._id.toString() !== source[propertyName]
    )
  ) {
    return left(ACErrors.ImmutabilityTargetImmutable)
  }

  return right(props.payload)
}

export const checkImmutability = async (context: Context<any, any, any>, props: AccessControlLayerProps<ReadPayload|WritePayload>) => {
  if( !props.parentId ) {
    return right(props.payload)
  }

  if( props.payload ) {
    for( const propertyName of Object.keys(props.payload) ) {
      const result = await internalCheck(context, {
        ...props,
        propertyName
      })

      if( isLeft(result) ) {
        return result
      }
    }
  }

  return internalCheck(context, props)
}
