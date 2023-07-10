import { defineCollection } from '@semantic-api/api'
import description, { Pet } from './description'

export default defineCollection(() => ({
  item: {} as Pet,
  description,
  functions: {
    bark: (person: string) => `Bark! *Bites ${person}*`,
    // performTrick: async (times: number, context: Context<typeof description>) => {
    //   const result = await context.collections.person.functions.getAll({
    //     filters: {
    //       job: 'baker'
    //     }
    //   }, context)

    //   return result
    // }
  },
}))
