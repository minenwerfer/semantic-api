export type ValuesOf<T> = T extends readonly string[]
  ? T[number]
  : T[keyof T]

export type DeepWritable<T, Skip=''> = {
  -readonly [P in keyof T]: P extends ValuesOf<Skip>
    ? T[P]
    : DeepWritable<T[P]>
}

