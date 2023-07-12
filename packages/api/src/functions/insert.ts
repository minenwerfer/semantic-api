import type { Description } from '@semantic-api/types'
import type { Context, MongoDocument } from '../types'
import type { Projection } from './types'
import { LEAN_OPTIONS } from '../constants'
import { useAccessControl } from '@semantic-api/access-control'
import { normalizeProjection, prepareInsert } from '../collection/utils'

export const insert = <
  TDescription extends Description,
  TDocument extends MongoDocument
>() => async (payload: {
  what: Partial<TDocument>,
  project?: Projection<TDocument>
}, context: Context<TDescription, Collections, Algorithms>) => {
  const accessControl = useAccessControl(context)

  const { _id } = payload.what
  const { what } = await accessControl.beforeWrite(payload, context)
  const readyWhat = prepareInsert(what, context.description)
  const projection = payload.project
    && normalizeProjection(payload.project, context.description)

  if( !_id ) {
    const newDoc = await context.model.create(readyWhat)
    return context.model.findOne({ _id: newDoc._id }, projection)
    .lean(LEAN_OPTIONS)
  }

  const options = {
    new: true,
    runValidators: true,
    projection
  }

  return context.model.findOneAndUpdate({ _id }, readyWhat, options)
    .lean(LEAN_OPTIONS) as Promise<TDocument>
}
