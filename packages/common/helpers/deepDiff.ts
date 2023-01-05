import * as R from 'ramda'

export const deepDiff = <T extends Record<string, any>>(origin: T, target: T, preserveIds?: boolean) => {
  const changes = (target: T, origin: T): any => {
    let arrayIdx = 0
    const res = Object.entries(target).reduce((a: any, [key, value]) => {
      if( value !== origin[key] ) {
        let resultKey = Array.isArray(origin)
          ? arrayIdx++
          : key

        if( R.is(Object, value) && R.is(Object, origin[key]) ) {
          const res = changes(value, origin[key])
          if( !Object.keys(res).length ) {
            return a
          }

          return {
            ...a,
            [resultKey]: res
          }
        }

        return {
          ...a,
          [resultKey]: value
        }
      }

      return a
    }, {})

    if( preserveIds && target._id && Object.keys(res).length > 0 ) {
      res._id = target._id
    }

    return res
  }

  return changes(target, origin)
}
