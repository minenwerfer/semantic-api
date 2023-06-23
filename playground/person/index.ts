import { getAll } from '@semantic-api/api/functions'
import description from './person.description'

export default () => ({
  description,
  functions: {
    hello: (pais: 'camboja'|'japao', numero: number) => 'world!',
    getAll
  },
})
