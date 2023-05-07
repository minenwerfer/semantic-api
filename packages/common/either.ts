export type Left<T> = {
  readonly _tag: 'Left'
  readonly value: T
}

export type Right<T> = {
  readonly _tag: 'Right'
  readonly value: T
}

export type Either<L, R> = Left<L> | Right<R>

export const left = <T>(value: T): Left<T> => ({
  _tag: 'Left',
  value
})

export const right = <T>(value: T): Right<T> => ({
  _tag: 'Right',
  value
})

export const isLeft = <L, R>(either: Either<L, R>): either is Left<L> => {
  return either._tag === 'Left'
}

export const isRight = <L, R>(either: Either<L, R>): either is Right<R> => {
  return either._tag === 'Right'
}

export const unwrapEither = <L, R>(either: Either<L, R>) => {
  return either.value
}
