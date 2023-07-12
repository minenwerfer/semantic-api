import type { Description } from '@semantic-api/types'
import type { Context, MongoDocument } from '../types'
import type { Filters, Projection, QuerySort } from './types'
import { useAccessControl } from '@semantic-api/access-control'
import { LEAN_OPTIONS, DEFAULT_SORT } from '../constants'
import { normalizeProjection } from '../collection/utils'

export const getAll = <
  TDescription extends Description,
  TDocument extends MongoDocument
>() => async (payload: {
  filters?: Filters<TDocument>
  project?: Projection<TDocument>
  offset?: number
  limit?: number
  sort?: QuerySort<TDocument>
}, context: Context<TDescription, Collections, Algorithms>) => {
  const accessControl = useAccessControl(context)

  const {
    filters = {},
    project = {},
    offset = 0,
    limit = process.env.PAGINATION_LIMIT || 35,
  } = payload || {}


  const entries = Object.entries(filters)
    .map(([key, value]) => [
      key,
      value && typeof value === 'object' && '_id' in value ? value._id : value
    ])

  const parsedFilters = Object.fromEntries(entries) || {}
  const query = await accessControl.beforeRead({ filters: parsedFilters }, context)

  const sort = payload?.sort
    ? payload.sort
    : query.sort || DEFAULT_SORT

  return context.model.find(query.filters, normalizeProjection(project, context.description))
    .sort(sort)
    .skip(offset)
    .limit(limit)
    .lean(LEAN_OPTIONS) as Promise<Array<TDocument>>
}
