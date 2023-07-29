import { getResources, type Collection, type Algorithm } from '@semantic-api/api'

if( process.env.MODE !== 'PRODUCTION' ) {
  require('dotenv').config()
}

const colors = {
  green: '\x1b[32m',
  blue: '\x1b[36m',
  red: '\x1b[31m',
  white: '\x1b[37m',
}

const colorizedRoute = (color: keyof typeof colors, resourceType?: 'collection' | 'algorithm') =>
  (verb: string, resourceName: string, path?: string|null, parameters?: Array<string>) => {
  const params = parameters
    ? '/' + parameters.map(p => `{${colors.green}${p}\x1b[0m}`).join('/')
    : ''

  return `\x1b[1m${colors[color]}${verb}\x1b[0m\t\x1b[90m/api\x1b[0m${resourceType === 'algorithm'?'/_':''}/\x1b[1m${resourceName}\x1b[0m${path?`/${path}`:''}${params}`
}

export const warmup = async () => {
  const { collections, algorithms } = await getResources() as {
    collections: Record<string, Collection>
    algorithms: Record<string, Algorithm>
  }

  const sortedResources = [
    ...Object.keys(collections).map((r) => <const>['collection', r]),
    ...Object.keys(algorithms).map((r) => <const>['algorithm', r]),

  ].sort((a, b) => {
    if( a[0] === 'algorithm' && b[0] === 'collection' ) {
      return -1
    }

    return a[1] > b[1]
      ? 1
      : -1
  })

  return Promise.all(sortedResources.map(async ([resourceType, resourceName]) => {
    const resource = resourceType === 'collection'
      ? await collections[resourceName]()
      : await algorithms[resourceName]()

    if( !resource.functions ) {
      return
    }

    const routes = Object.keys(resource.functions).sort().map((fn) => {
      if( resourceType === 'collection' ) switch( fn ) {
        case 'get': return colorizedRoute('green', resourceType)('GET', resourceName, null, ['id'])
        case 'getAll': return colorizedRoute('green', resourceType)('GET', resourceName)
        case 'insert': return colorizedRoute('blue', resourceType)('POST', resourceName)
        case 'remove': return colorizedRoute('red', resourceType)('DELETE', resourceName, null, ['id'])
        default: return colorizedRoute('white', resourceType)('POST', resourceName, fn)
      }

      return colorizedRoute('white', resourceType)('POST', resourceName, fn)
    })

    console.log(routes.join('\n'))

  }))
}
