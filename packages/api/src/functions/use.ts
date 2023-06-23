import type { MongoDocument } from '../types'
import * as collFunctions from '.'

export const useFunctions = <T extends MongoDocument>(selectedFunctions?: Array<Exclude<keyof typeof collFunctions, '_delete'> | 'delete'>) => {
  const functions = {
    count: collFunctions.count<T>(),
    get: collFunctions.get<T>(),
    getAll: collFunctions.getAll<T>(),
    delete: collFunctions._delete<T>(),
    deleteAll: collFunctions.deleteAll<T>(),
    deleteFile: collFunctions.deleteFile<T>(),
    insert: collFunctions.insert<T>(),
    modify: collFunctions.modify<T>(),
    modifyAll: collFunctions.modifyAll<T>(),
    upload: collFunctions.upload<T>(),
  }

  if( selectedFunctions ) {
    return selectedFunctions.reduce((a, fnName) => ({
      ...a,
      [fnName]: functions[fnName]
    }), {} as typeof functions)
  }

  return functions
}
