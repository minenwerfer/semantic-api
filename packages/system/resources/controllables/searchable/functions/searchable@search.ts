import type { ApiFunction } from '../../../../../api/types'
import { mongoose } from '../../../../../api/core/database'
import { makeException } from '../../../../../api/core/exceptions'
import { isGranted } from '../../../../../api/core/accessControl/granted'

type Props = {
  query: Array<string>
}

const search: ApiFunction<Props, typeof import('../searchable.library')> = async (props, context) => {
  const { token, accessControl } = context

  if( !token?.user?.roles.length ) {
    throw makeException({
      name: 'AuthorizationError',
      message: 'signed out'
    })
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

  const beforeRead = accessControl.beforeRead
    ? (payload: Record<string, any>) => accessControl.beforeRead!(payload, context)
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
