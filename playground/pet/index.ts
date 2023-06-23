import { defineCollection } from '@semantic-api/api'
import description from './description'

export default defineCollection(() => ({
  description,
  functions: {
    bark: (person: string) => console.log(`Bark! *Bites ${person}*`),
    performTrick: (times: number) => console.log(`*sits ${times}x*`)
  },
}))
