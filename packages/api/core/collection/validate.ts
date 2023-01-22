import { Types } from 'mongoose'
import type { Description, CollectionProperty } from '../../../types'
import { makeException } from '../exceptions'
import { getTypeConstructor } from './typemapping'

export type ValidateFunction<T> = (what: T, required?: Array<keyof T>|null, description?: Omit<Description, '$id'>) => void

const runtimeValidationError = (message: string, details?: Record<string, any>) => makeException({
  name: 'RuntimeValidationError',
  message,
  details
})

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

export const validateFromDescription = <T>(
  description: Omit<Description, '$id'>,
  what: T,
  required?: Array<keyof T>|null,
  ..._: any[]
) => {
  if( !what ) {
    throw runtimeValidationError('target is empty')
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
    details: {
      expected: string
      got: string
    }
  }> = {}

  propsSet.forEach((_prop) => {
    const prop = _prop as string
    const value = what[prop as keyof T]
    const property = description.properties[prop]

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

    const expectedConstructor = getTypeConstructor(description.properties[prop])
    const actualConstructor = (value as any).constructor

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
  })

  if( Object.keys(errors).length > 0 ) {
    throw runtimeValidationError('some properties failed to validate', errors)
  }
}
