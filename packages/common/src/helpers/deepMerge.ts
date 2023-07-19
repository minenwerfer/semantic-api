import * as R from 'ramda'

export type MergeOptions = {
  arrays?: false
}

export const deepMerge = <TLeft, TRight>(left: TLeft, right: TRight, options?: MergeOptions): TLeft & TRight => {
  const mergeArrays = (left: any) => options?.arrays !== false || !R.is(Array, left)
  const merged = Object.assign({}, left)

  return Object.assign(merged, R.mergeDeepWith(
    (l, r) => R.is(Object, l) && R.is(Object, r) && mergeArrays(l)
      ? R.concat(l, r)
      : r,
    left,
    right
  ))
}

