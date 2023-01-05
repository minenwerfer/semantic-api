import type { FunctionPath, DecodedToken, ApiContext, Role } from '../../types'
import baseRoles from './baseRoles'

const _isGranted = (
  functionPath: FunctionPath,
  token: DecodedToken,
  context: ApiContext,
  targetRole?: Role
) => {
  const [entityName, functionName] = functionPath.split('@')

  const userRoles = token?.user?.roles || ['guest']
  return userRoles.some((roleName) => {
    const currentRole = targetRole || context.accessControl.roles?.[roleName]

    if( !currentRole ) {
      return false
    }

    const subject = currentRole?.capabilities?.[entityName]
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
  token: DecodedToken,
  context: ApiContext
) => {
  const baseRole = token?.user?._id
    ? baseRoles.authenticated
    : baseRoles.unauthenticated

  return _isGranted(functionPath, token, context)
    || _isGranted(functionPath, token, context, baseRole)
}
