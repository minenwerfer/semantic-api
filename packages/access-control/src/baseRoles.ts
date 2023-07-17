export const baseRoles = <const>{
  authenticated: {
    capabilities: {
      meta: {
        functions: [
          'describeAll'
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
}
