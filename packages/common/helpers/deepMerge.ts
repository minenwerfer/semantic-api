import * as R from 'ramda'

export type MergeOptions = {
  arrays?: false
}

export const deepMerge = (left: any, right: any, options?: MergeOptions) => {
  const mergeArrays = (left: any) => options?.arrays !== false || !R.is(Array, left)

  return Object.assign(left, R.mergeDeepWith(
    (l, r) => R.is(Object, l) && R.is(Object, r) && mergeArrays(l)
      ? R.concat(l, r)
      : r,
    left,
    right
  ))
}

