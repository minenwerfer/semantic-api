import { createContext } from '@semantic-api/api'
import { description, type Pet } from './description'

export default () => ({
  item: {} as typeof Pet,
  description,
  functions: {
    bark: (person: string) => `Bark! *Bites ${person}*`,
    addPerson: async (_arg: null, context: Context<typeof description>) => {
      const personContext = await createContext({
        resourceName: 'person',
        parentContext: context
      })

      await context.collections.person.functions.insert({
        what: {
          name: `Person nº ${Math.round(Math.random()*10)}`,
          job: 'baker'
        }
      }, personContext)

      const result = await context.collections.person.functions.getAll({
        filters: {
          job: 'baker'
        }
      }, personContext)

      return result
    },
    validatePerson: async (_arg: null, context: Context<typeof description>) => {
      const result = await context.validate(description, {
        name: 1
      }, ['name'])

      return result
    }
  }
})
