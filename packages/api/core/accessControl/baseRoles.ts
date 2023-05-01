import { Role } from '../../types'

export default {
  authenticated: {
    capabilities: {
      meta: {
        functions: [
          'describeAll'
        ]
      },
      searchable: {
        functions: [
          'search'
        ]
      },
      file: {
        forbidEverything: true,
        functions: [
          'download'
        ]
      },
      user: {
        functions: [
          'insert',
          'authenticate',
          'ping',
          'upload'
        ]
      },
      userExtra: {
        grantEverything: true
      }
    }
  },
  unauthenticated: {
    capabilities: {
      meta: {
        functions: [
          'describeAll'
        ]
      },
      user: {
        functions: [
          'insert',
          'authenticate',
          'ping'
        ]
      }
    }
  }
} as Record<string, Role>
