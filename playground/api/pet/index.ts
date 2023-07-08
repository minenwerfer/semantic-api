import { defineCollection } from '@semantic-api/api'
import description, { Pet } from './description'

export default defineCollection(() => ({
  item: {} as Pet,
  description,
  functions: {
    bark: (person: string) => `Bark! *Bites ${person}*`,
    performTrick: (times: number, context: Context<typeof description>) => {
      console.log(context)
      return `*sits ${times}x*`
    }
  },
}))
