import { defineCollection } from '@semantic-api/api'
import description from './description'

export default defineCollection(() => ({
  description,
  functions: {
    bark: (person: string) => `Bark! *Bites ${person}*`,
    performTrick: (times: number, context: Context<typeof description>) => {
      console.log(context)
      return `*sits ${times}x*`
    }
  },
}))
