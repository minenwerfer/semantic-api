import description from './person.description'

export default <const>{
  description,
  functions: {
    hello: () => 'world!'
  },
  fallbackFunctions: [
    'getAll'
  ]
}
