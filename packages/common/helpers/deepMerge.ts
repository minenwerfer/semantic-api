import * as R from 'ramda'

export const deepMerge = (left: any, right: any) => Object.assign(left, R.mergeDeepWith(
  (l, r) => R.is(Object, l) && R.is(Object, r)
    ? R.concat(l, r)
    : r,
  left,
  right
))

