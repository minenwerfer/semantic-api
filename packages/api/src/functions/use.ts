import type { Description } from '@semantic-api/types'
import type { MongoDocument } from '../types'
import * as collFunctions from '.'

const getFunctions = <
  TDocument extends MongoDocument,
  TDescription extends Description
>() => ({
  count: collFunctions.count<TDescription, TDocument>(),
  get: collFunctions.get<TDescription, TDocument>(),
  getAll: collFunctions.getAll<TDescription, TDocument>(),
  remove: collFunctions.remove<TDescription, TDocument>(),
  removeAll: collFunctions.removeAll<TDescription, TDocument>(),
  removeFile: collFunctions.removeFile<TDescription, TDocument>(),
  insert: collFunctions.insert<TDescription, TDocument>(),
  modify: collFunctions.modify<TDescription, TDocument>(),
  modifyAll: collFunctions.modifyAll<TDescription, TDocument>(),
  upload: collFunctions.upload<TDescription, TDocument>(),
})

type SelectFunctions<TSelectedFunctions extends Array<keyof typeof collFunctions>> = TSelectedFunctions extends Array<infer K>
  ? K
  : keyof typeof collFunctions

export const useFunctions = <
  TDocument extends MongoDocument,
  TDescription extends Description
>() => <TSelectedFunctions extends Array<keyof typeof collFunctions>>(
  selectedFunctions?: TSelectedFunctions
): {
  [P in SelectFunctions<TSelectedFunctions>]: ReturnType<typeof getFunctions<TDocument, TDescription>>[P]
} => {

  const functions = getFunctions<TDocument, TDescription>()

  if( selectedFunctions ) {
    return selectedFunctions.reduce((a, fnName) => ({
      ...a,
      [fnName]: functions[fnName]
    }), {} as typeof functions)
  }

  return functions
}
