import { readdirSync } from 'fs'
import type { Description } from '../../../../types'
import type { ApiContext } from '@semantic-api/api'
import { preloadDescription, getResourceAsset } from '@semantic-api/api'
import SystemCollections from '../../collections'

const __cachedDescriptions: Record<string, Description> = {}
export const cachedDescriptions = __cachedDescriptions

const discoverDescriptions = ({ dynamic, system }: { dynamic?: boolean, system?: boolean }) => {
  const path = system
    ? `${__dirname}/../../collections`
    : `${process.cwd()}/resources/collections`

  if( dynamic ) {
    return require(path)
  }

  try {
    return readdirSync(path).reduce((a: Record<string, any>, d) => {
      try {
        const description = getResourceAsset(d, 'description')
        if( !system && !description.system && d in SystemCollections  ) {
          throw new Error(
            `your collection "${d}" is overriding an internal collection. if this was intended, please add "system: true" to your description, otherwise rename your collection`
          )
        }

        return {
          ...a,
          [d]: description
        }
      } catch(e: any) {
        if( e.code !== 'MODULE_NOT_FOUND' ) {
          throw e
        }

        return a
      }
    }, {})

  } catch( e: any ) {
    if( e.code === 'ENOENT' ) {
      return {}
    }

    throw e
  }
}

export const getDescriptions = ({
  descriptions: presetDescriptions,
  apiConfig: {
    dynamicCollections
  },
}: ApiContext<any>): Record<string, Description> => {
  if( Object.keys(__cachedDescriptions).length > 0 ) {
    return __cachedDescriptions
  }

  const target: Record<string, Description> = {
    ...presetDescriptions||{},
    ...discoverDescriptions({ dynamic: dynamicCollections }),
    ...discoverDescriptions({ system: true })
  }

  const descriptions = Object.entries(target).reduce((a, [, collectionSchema]) => {
    return {
      ...a,
      [collectionSchema.$id]: preloadDescription(collectionSchema)
    }
  }, {})

  Object.assign(__cachedDescriptions, descriptions)

  global.descriptions = __cachedDescriptions
  return descriptions
}

