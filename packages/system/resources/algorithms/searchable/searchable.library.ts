import type { Description } from '../../../../types'
import type { ApiContext } from '../../../../api/types'
import { getResourceAsset } from '../../../../api'

const __searchable: Record<string, Description> = {}

export const getSearchables = (context: ApiContext) => {
  if( Object.keys(__searchable).length > 0 ) {
    return __searchable
  }

  const descriptions = getResourceAsset('meta', 'library', 'algorithm').getDescriptions(context)

  const searchable = Object.entries(descriptions)
    .reduce((a, [collectionName, description]: [string, any]) => {
      if( !description.searchable?.indexes || description.alias ) {
        return a
      }

      const indexes = description.searchable.indexes.reduce((a: Record<string, any>, index: string) => {
        const property = description.properties[index]
        if( !property ) {
          return a
        }

        if( property.collection || property.values?.[0]?.__query ) {
          throw new Error(
            `searchable index cannot be a reference: ${index} @ ${collectionName}`
          )
        }

        const { description: propertyDescription, type } = property

        return {
          ...a,
          [index]: {
            propertyDescription,
            type
          }
        }
      }, {})

      // force model registration
      getResourceAsset(collectionName, 'model')

      return {
        ...a,
        [collectionName]: {
          ...description.searchable,
          indexes
        }
      }
  }, {})

  Object.assign(__searchable, searchable)
  return searchable
}

export const buildAggregations = (
  searchables: any,
  query: Array<string>,
  beforeRead: ((payload: any) => void)|null
) => {
  const aggregations: Record<string, any> = {}

  Object.entries(searchables).forEach(([collectionName, config]: [string, any]) => {
    const matches = Object.entries(config.indexes).reduce((a: Record<string, any>, [indexName, index]: [string, any]) => {
      const getType: any = (q: any) => {
        switch(index.type) {
          case 'number':
          case 'integer':
          case 'float':
            return Number(q)
          case 'text':
          default:
            return {
              $regex: q,
              $options: 'i'
          }
        }
      }

      return {
        $or: [
          ...a.$or,
          ...query.map((q: string) => ({ [indexName]: getType(q) }))
        ]
      }

    }, { $or: [] })

    const project = Object.keys(config.indexes)
      .reduce((a: Record<string, any>, index: string) => ({ ...a, [index]: 1 }), {})

    if( config.picture ) {
      project._picture = `$${config.picture}`
    }

    if( beforeRead ) {
      beforeRead({ filters: matches })
    }

    aggregations[collectionName] = [
      { $match: matches },
      { $limit: 5 },
      { $project: project }
    ]
  })

  return aggregations
}

