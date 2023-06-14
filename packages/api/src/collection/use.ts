import type { ApiContext, ApiContextWithAC, MongoDocument } from '../types'
import { useAccessControl } from '@semantic-api/access-control'
import { getResourceAsset } from '../assets'
// import useFunctions from './functions'

export const useCollection = async <T extends MongoDocument>(collectionName: string, _context: ApiContext|null = null) => {
  const context = _context || {} as ApiContext

  const description = context.description = context.description?.$id === collectionName
    ? context.description
    : await getResourceAsset(collectionName, 'description')

  if( !description ) {
    throw new Error(
      `description of ${collectionName} not found`
    )
  }

  const originalCollectionName = description.alias || collectionName
  const model = getResourceAsset(originalCollectionName, 'model')

  const acFunctions = useAccessControl(description, context)
  const contextWithAC: ApiContextWithAC = {
    ...context,
    resourceName: collectionName,
    acFunctions
  }

  // const functions = useFunctions<T>(
  //   await (model as typeof model | Promise<typeof model>),
  //   description,
  //   contextWithAC
  // )
  //
  const functions = {
    empty: 'nothing to be seen here'
  }

  return {
    ...functions,
    model: () => model
  }
}
