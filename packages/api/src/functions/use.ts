import type { Description } from '@semantic-api/types'
import type { MongoDocument } from '../types'
import type { Context } from '../context'
import * as collFunctions from '.'

export const useFunctions = <
  TDocument extends MongoDocument,
  TDescription extends Description
>(
  context: Context<TDescription, Collections>,
  selectedFunctions: Array<Exclude<keyof typeof collFunctions, '_delete'> | 'delete'>,
) => {
  const functions = {
    count: collFunctions.count<TDescription, TDocument>(context),
    get: collFunctions.get<TDescription, TDocument>(context),
    getAll: collFunctions.getAll<TDescription, TDocument>(context),
    delete: collFunctions._delete<TDescription, TDocument>(context),
    deleteAll: collFunctions.deleteAll<TDescription, TDocument>(context),
    deleteFile: collFunctions.deleteFile<TDescription, TDocument>(context),
    insert: collFunctions.insert<TDescription, TDocument>(context),
    modify: collFunctions.modify<TDescription, TDocument>(context),
    modifyAll: collFunctions.modifyAll<TDescription, TDocument>(context),
    upload: collFunctions.upload<TDescription, TDocument>(context),
  }

  if( selectedFunctions ) {
    return selectedFunctions.reduce((a, fnName) => ({
      ...a,
      [fnName]: functions[fnName]
    }), {} as typeof functions)
  }

  return functions
}
