import type { Context, Collection, Algorithm } from '@semantic-api/api'

export type AccessControlLayer<
  TCollections extends Record<string, Awaited<ReturnType<Collection>>>,
  TAlgorithms extends Record<string, Awaited<ReturnType<Algorithm>>>
> = (context: Context<any, TCollections, TAlgorithms>, props: {
  propertyName?: string
  parentId?: string
  childId?: string
  payload: Record<string, any>

}) => Promise<void>
