import type { Description } from '@semantic-api/types'
import type { MongoDocument } from '../types'
import * as collFunctions from '.'

export const useFunctions = <
  TDocument extends MongoDocument,
  TDescription extends Description
>(
  selectedFunctions?: Array<Exclude<keyof typeof collFunctions, '_delete'> | 'delete'>,
) => {
  const functions = {
    count: collFunctions.count<TDescription, TDocument>(),
    get: collFunctions.get<TDescription, TDocument>(),
    getAll: collFunctions.getAll<TDescription, TDocument>(),
    delete: collFunctions._delete<TDescription, TDocument>(),
    deleteAll: collFunctions.deleteAll<TDescription, TDocument>(),
    deleteFile: collFunctions.deleteFile<TDescription, TDocument>(),
    insert: collFunctions.insert<TDescription, TDocument>(),
    modify: collFunctions.modify<TDescription, TDocument>(),
    modifyAll: collFunctions.modifyAll<TDescription, TDocument>(),
    upload: collFunctions.upload<TDescription, TDocument>(),
  }

  if( selectedFunctions ) {
    return selectedFunctions.reduce((a, fnName) => ({
      ...a,
      [fnName]: functions[fnName]
    }), {} as typeof functions)
  }

  return functions
}
