import type { CollectionProperty, ValuesOf, JsonSchema } from '../../../types'
export type { Description } from '../../../types'
import type { MongoDocument, Reference } from '../../types'
export { Reference }

export type Schema<T extends JsonSchema> = CaseOwned<T>

export type SchemaProperties<T> = T & {
  [
    P in keyof T as
    P extends keyof JsonSchema
      ? P
      : never
  ]: P extends 'properties'
    ? Writable<T[P]>
    : T[P]
}

type Owned = {
  owner: Reference
}

type MapType<T> = T extends { format: 'date'|'date-time' }
  ? Date : T extends { type: 'string' }
  ? string : T extends { type: 'number' }
  ? number : T extends { type: 'boolean' }
  ? boolean : T extends { properties: any }
  ? Schema<T & { $id: '' }> : T extends { type: 'object' }
  ? object: T extends { enum: ReadonlyArray<infer K> }
  ? K : T extends { $ref: string }
  ? Reference : never

type CaseReference<T> = T extends { $id: string }
  ? Reference
  : T extends { type: 'array', items: { properties: any } }
  ? Array<MapType<T['items']>>
  : T extends { type: 'array', items: infer K }
  ? Array<MapType<K>>
  : MapType<T>

type Type<T> = CaseReference<T>

type IsRequired<
  F,
  ExplicitlyRequired,
  Value
> = keyof {
  [
    P in keyof F as
    P extends ValuesOf<ExplicitlyRequired>
      ? Value extends true
      ? P
      : never
      : never
  ]: F[P]
}

type IsReadonly<F> = keyof {
  [
    P in keyof F as
    F[P] extends { readOnly: true }
      ? P
      : never
  ]: F[P]
}

type RequiredProperties<F, E> = IsRequired<F, E, true>
type UnrequiredProperties<F> = IsRequired<F, '', false>
type ReadonlyProperties<F> = IsReadonly<F>

type OptionalProperties<F, E> = Exclude<keyof F, RequiredProperties<F, E> | ReadonlyProperties<F>>

type StrictMode<F> = MongoDocument &
  { -readonly [P in keyof F]: Type<F[P]> } &
  { -readonly [P in UnrequiredProperties<F>]?: Type<F[P]> } &
  { readonly [P in ReadonlyProperties<F>]: Type<F[P]> }

type PermissiveMode<F, E> = MongoDocument &
  { [P in OptionalProperties<F, E>]?: Type<F[P]> } &
  { -readonly [P in RequiredProperties<F, E>]: Type<F[P]> } &
  { readonly [P in ReadonlyProperties<F>]?: Type<F[P]> }

type CaseOwned<T extends JsonSchema> = T extends { owned: true }
  ? Owned & MapTypes<T>
  : MapTypes<T>

type MapTypes<
  S extends JsonSchema,
  F=S['properties'],
  ExplicitlyRequired=S['required']
> = S extends { strict: true }
  ? StrictMode<F>
  : PermissiveMode<F, ExplicitlyRequired>

type Aux<T> = {
  -readonly [P in keyof T]: T[P] extends ReadonlyArray<infer K>
    ? T[P] & ReadonlyArray<K>
    : P extends keyof CollectionProperty
    ? CollectionProperty[P]
    : never
}

type Writable<T> = {
  -readonly [P in keyof T]: Aux<T[P]>
}
