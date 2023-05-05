import type { FunctionPath, ApiContext, Role } from '../../types'
import { deepMerge } from '@semantic-api/common'

const applyInheritance = (context: ApiContext, targetRole: Role) => {
  const role = Object.assign({}, targetRole)
  if( role.inherit ) {
    for( const roleName of role.inherit ) {
      const parentRole = context.accessControl.roles?.[roleName]
      if( !parentRole ) {
        throw new Error(`inherit: role ${roleName} doesnt exist`)
      }

      deepMerge(role, applyInheritance(context, parentRole))
    }
  }

  return role
}

const internalIsGranted = (functionPath: FunctionPath, context: ApiContext) => {
  const [resourceName, functionName] = functionPath.split('@')

  const userRoles: Array<string> = context.token?.user?.roles || ['guest']
  return userRoles.some((roleName) => {
    const currentRole = context.accessControl.roles?.[roleName]
    if( !currentRole ) {
      throw new Error(`role ${roleName} doesnt exist`)
    }

    deepMerge(currentRole, applyInheritance(context, currentRole))

    const subject = currentRole?.capabilities?.[resourceName]
    if( subject?.blacklist?.includes(functionName) ) {
      return false
    }

    const allowedInToken = !context.token.allowed_functions || (
      context.token.allowed_functions.includes(functionPath)
    )

    return allowedInToken
      && (!currentRole.forbidEverything || subject?.functions?.includes(functionName))
      && (
        currentRole?.grantEverything
        || subject?.grantEverything
        || subject?.functions?.includes(functionName)
      )
  })
}

export const isGranted = (functionPath: FunctionPath, context: ApiContext) => {
  return internalIsGranted(functionPath, context)
}
