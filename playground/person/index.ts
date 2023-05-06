import description from './person.description'

export default {
  description,
  functions: {
    hello: () => 'world!'
  },
  fallbackFunctions: [
    'getAll'
  ]
} as const
