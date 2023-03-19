import type { ApiFunction } from '@semantic-api/api'
import { makeException, isGranted } from '@semantic-api/api'
import { mongoose } from '@semantic-api/api/database'

type Props = {
  query: Array<string>
}

const search: ApiFunction<Props, typeof import('../searchable.library')> = async (props, context) => {
  const { token, accessControl } = context

  if( !token?.user?.roles.length ) {
    throw new (makeException({
      name: 'AuthorizationError',
      message: 'signed out'
    }))
  }

  props.query = props.query.filter((q) => !!q)
  if( !props?.query || props.query.length === 0 ) {
    throw new Error('no query provided')
  }

  const searchables = Object.entries(context.library.getSearchables(context))
    .reduce((a, [key, value]) => {
      if( !isGranted(`${key}@getAll`, context) ) {
        return a
      }

      return {
        ...a,
        [key]: value
      }
  }, {})

  const beforeRead = accessControl.layers?.read
    ? (payload: Record<string, any>) => accessControl.layers?.read!(context, { payload })
    : null

  const aggregations = context.library.buildAggregations(
    searchables,
    props.query,
    beforeRead
  )

  const result: Record<string, any> = {}

  for (const [collectionName, aggregation] of Object.entries(aggregations)) {
    result[collectionName] = await mongoose.model(collectionName).aggregate(aggregation)
  }

  return result
}

export default search
