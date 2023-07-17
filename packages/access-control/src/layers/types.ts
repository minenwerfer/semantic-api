import type { Context, CollectionStructure, Algorithm } from '@semantic-api/api'
import type { AccessControl } from '../types'

// #region AccessControlLayer
export type AccessControlLayer<
  TCollections extends Record<string, CollectionStructure>,
  TAlgorithms extends Record<string, Awaited<ReturnType<Algorithm>>>,
  TAccessControl extends AccessControl<TCollections, TAlgorithms>=any
> = (context: Context<any, TCollections, TAlgorithms, TAccessControl>, props: {
  propertyName?: string
  parentId?: string
  childId?: string
  payload: Record<string, any>

}) => Promise<void>
// #endregion AccessControlLayer
