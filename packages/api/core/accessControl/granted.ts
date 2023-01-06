import type { FunctionPath, ApiContext, Role } from '../../types'
import baseRoles from './baseRoles'

const _isGranted = (
  functionPath: FunctionPath,
  context: ApiContext,
  targetRole?: Role
) => {
  const [resourceName, functionName] = functionPath.split('@')

  const userRoles: Array<string> = context.token?.user?.roles || ['guest']
  return userRoles.some((roleName) => {
    const currentRole = targetRole || context.accessControl.roles?.[roleName]

    if( !currentRole ) {
      return false
    }

    const subject = currentRole?.capabilities?.[resourceName]
    if( subject?.blacklist?.includes(functionName) ) {
      return false
    }

    return (
      currentRole?.grantEverything
      || subject?.grantEverything
      || subject?.methods?.includes(functionName)
    )
  })
}

export const isGranted = (
  functionPath: FunctionPath,
  context: ApiContext
) => {
  const baseRole = context.token?.user?._id
    ? baseRoles.authenticated
    : baseRoles.unauthenticated

  return _isGranted(functionPath, context)
    || _isGranted(functionPath, context, baseRole)
}
