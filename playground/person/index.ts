import { defineCollection, useFunctions } from '@semantic-api/api'
import description from './description'

import type { Person } from './description'

const { getAll } = useFunctions<Person>()

export default defineCollection(() => ({
  description,
  functions: {
    hello: (pais: 'camboja'|'japao', numero: number) => 'world!',
    getAll
  },
}))
