import type { Description, CollectionProperty } from '@semantic-api/types'
import { left } from '@semantic-api/common'
import { Types } from 'mongoose'
import { getTypeConstructor } from './typemapping'

export type ValidateFunction<T> = (what: T, required?: Array<keyof T>|null, description?: Omit<Description, '$id'>) => void

export enum ValidationErrors {
  EmptyTarget = 'EMPTY_TARGET',
  InvalidProperties = 'INVALID_PROPERTIES'
}

const isValidReference = (property: CollectionProperty, value: any) => {
  if( !property.s$isReference ) {
    return false
  }

  try {
    new Types.ObjectId(value)
    return true
  } catch(e) {
    return false
  }
}

export const validateFromDescription = async <T>(
  description: Omit<Description, '$id'>,
  what: T,
  required?: Array<keyof T>|null,
  ..._: any[]
) => {
  if( !what ) {
    return left({
      code: ValidationErrors.EmptyTarget
    })
  }

  const propsSet = required
    ? new Set([ ...required, ...Object.keys(what) ])
    : new Set([ ...Object.keys(description.properties), ...Object.keys(what) ])

  const getType = (value: any) => {
    return Array.isArray(value)
      ? 'array'
      : typeof value
  }

  const errors: Record<string, {
    type: 'extraneous'
      | 'missing'
      | 'unmatching'
      | 'extraneous_element'
      | 'numeric_constraint'
    details: {
      expected: string
      got: string
    }
  }> = {}

  for( const _prop of propsSet ) {
    const prop = _prop as string
    const value = what[prop as keyof T]
    const property = description.properties[prop]

    if( prop === '_id' && typeof value === 'string' ) {
      return
    }

    if( !property ) {
      errors[prop] = {
        type: 'extraneous',
        details: {
          expected: 'undefined',
          got: getType(value)
        }
      }

      return
    }

    if( !value ) {
      if(
        (!required && description.required?.includes(prop))
        || (required && required.includes(prop as keyof T))
      ) {
        errors[prop] = {
          type: 'missing',
          details: {
            expected: property.type as string,
            got: 'undefined'
          }
        }
      }

      return
    }

    const expectedConstructor = await getTypeConstructor(description.properties[prop], () => null)
    const actualConstructor = (value as any).constructor

    if( expectedConstructor === Number ) {
      if(
          (property.maximum && property.maximum < <number>value)
          || (property.minimum && property.minimum > <number>value)
          || (property.exclusiveMaximum && property.exclusiveMaximum <= <number>value)
          || (property.exclusiveMinimum && property.exclusiveMinimum >= <number>value)
      ) {
        errors[prop] = {
          type: 'numeric_constraint',
          details: {
            expected: 'number',
            got: 'invalid_number'
          }
        }
      }
    }

    if(
      actualConstructor !== expectedConstructor
      && !(Array.isArray(expectedConstructor) && actualConstructor === Array)
      && !(isValidReference(property, value))
    ) {
      errors[prop] = {
        type: 'unmatching',
        details: {
          expected: property.type as string,
          got: getType(value)
        }
      }
    }

    if( Array.isArray(expectedConstructor) ) {
      const extraneous = (value as Array<any>).find((v) => (
        v.constructor !== expectedConstructor[0]
          && !isValidReference(property, v)
      ))

      if( extraneous ) {
        errors[prop] = {
          type: 'extraneous_element',
          details: {
            expected: getType(expectedConstructor[0]()),
            got: getType(extraneous)
          }
        }
      }
    }
  }

  if( Object.keys(errors).length > 0 ) {
    return left({
      code: ValidationErrors.InvalidProperties,
      errors
    })
  }
}
