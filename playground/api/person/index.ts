import { defineCollection, useFunctions } from '@semantic-api/api'
import description from './description'
import type { Person } from './description'

const { getAll } = useFunctions<Person>()

export default defineCollection(() => ({
  description,
  functions: {
    test(name: string, context: Context<typeof description>) {
      context.collections.pet.functions.performTrick(2)
      context.collection.functions.test
      return {}
    },
    getAll
  },
}))
