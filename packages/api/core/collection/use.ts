import type { ApiContext, ApiContextWithAC } from '../../types'
import { getEntityAsset } from '../assets'
import { useAccessControl } from '../accessControl/use'
import useFunctions from './functions'

export const useCollection = (collectionName: string, _context: ApiContext|null = null) => {
  const context = _context || {} as ApiContext

  const description = getEntityAsset(collectionName, 'description')
  const originalCollectionName = description.alias || collectionName

  const model = getEntityAsset(originalCollectionName, 'model')

  if( !description ) {
    throw new Error(
      `description of ${collectionName} not found`
    )
  }

  const acFunctions = useAccessControl(description, context)
  const contextWithAC: ApiContextWithAC = {
    ...context,
    entityName: collectionName,
    acFunctions
  }

  const functions = useFunctions(
    model,
    description,
    contextWithAC
  )

  return {
    ...functions,
    model
  }
}
