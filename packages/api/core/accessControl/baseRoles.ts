import { Role } from '../../types'

export default {
  authenticated: {
    capabilities: {
      meta: {
        methods: [
          'describeAll'
        ]
      },
      searchable: {
        methods: [
          'search'
        ]
      },
      file: {
        methods: [
          'insert'
        ]
      },
      user: {
        methods: [
          'insert',
          'authenticate',
          'ping'
        ]
      },
      userExtra: {
        methods: [
          'insert'
        ]
      }
    }
  },
  unauthenticated: {
    capabilities: {
      meta: {
        methods: [
          'describeAll'
        ]
      },
      user: {
        methods: [
          'insert',
          'authenticate'
        ]
      }
    }
  }
} as Record<string, Role>
