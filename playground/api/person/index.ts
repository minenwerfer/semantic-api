import { defineCollection, useFunctions } from '@semantic-api/api'
import description from './description'
import type { Person } from './description'

const { getAll } = useFunctions<Person, typeof description>()

export default defineCollection(() => ({
  item: {} as Person,
  description,
  functions: {
    // test(name: string, context: Context<typeof description>) {
    //   context.collections.pet.functions.performTrick(2)
    //   context.collection.functions.test
    //   return {}
    // },
    getAll
  },
}))
