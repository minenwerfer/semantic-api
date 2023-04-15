export * from './resources/collections'
import type { Collections, Algorithms } from '@semantic-api/api'

export const getCollections = (): Collections => {
  return {
    apiKey: require('./resources/collections/apiKey'),
    file: require('./resources/collections/file'),
    log: require('./resources/collections/log'),
    resourceUsage: require('./resources/collections/resourceUsage'),
    user: require('./resources/collections/user')
  }
}

export const getAlgorithms = (): Algorithms => {
  return {
    meta: require('./resources/algorithms/meta'),
    searchable: require('./resources/algorithms/searchable'),
  }
}
