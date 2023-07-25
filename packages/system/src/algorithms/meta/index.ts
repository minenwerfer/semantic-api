import describe from './describe'

export default () => ({
  functions: {
    describe,
    test: (name: 'joao'|'jurandir') => `Hello, ${name}!`
  }
})
