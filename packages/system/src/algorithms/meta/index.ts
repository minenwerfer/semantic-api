import describeAll from './describeAll'

export default () => ({
  functions: {
    describeAll,
    test: (name: 'joao'|'jurandir') => `Hello, ${name}!`
  }
})
