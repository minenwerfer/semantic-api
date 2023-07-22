export type MergeOptions = {
  arrays?: false
}

export const deepMerge = <
  TLeft extends Record<keyof TRight, any>,
  TRight extends object
>(left: TLeft, right: TRight, options?: MergeOptions): TLeft & TRight => {
  const result = Object.assign({}, left)

  for( const key in right ) {
    const leftVal: any = result[key]
    const rightVal: any = right[key]

    if( Array.isArray(leftVal) && Array.isArray(rightVal) ) {
      result[key] = options?.arrays
        ? result[key].concat(...rightVal)
        : rightVal

      continue
    }

    if( leftVal instanceof Object && rightVal instanceof Object ) {
      result[key] = deepMerge(leftVal, rightVal, options)
      continue
    }

    result[key] = rightVal
  }

  return result
}
