import type { AccessControl, Role } from '../../types'
import { deepMerge } from '@semantic-api/common'

let __accessControl: AccessControl<any>|null = null

const getAccessControl = async () => {
  if ( !__accessControl ) {
    __accessControl = (await import(process.cwd() + '/index.js')).accessControl
  }

  return __accessControl!
}

const applyInheritance = async (accessControl: AccessControl<any>, targetRole: Role<any>) => {
  const role = Object.assign({}, targetRole)

  if( role.inherit ) {
    for( const roleName of role.inherit ) {
      const parentRole = accessControl.roles?.[roleName]
      if( !parentRole ) {
        throw new Error(`inherit: role ${roleName} doesnt exist`)
      }

      delete parentRole.inherit
      deepMerge(role, await applyInheritance(accessControl, parentRole))
    }
  }

  return role
}

export const isGranted = async <
  const ResourceName extends keyof TesteConfig['collections'],
  const FunctionName extends string
>(
  resourceName: ResourceName,
  functionName: FunctionName,
  acProfile: UserACProfile
) => {
  const userRoles = acProfile.roles
  const accessControl = await getAccessControl()

  for( const roleName of userRoles ) {
    const _currentRole = accessControl.roles?.[roleName]
    if( !_currentRole ) {
      throw new Error(`role ${roleName} doesnt exist`)
    }

    const currentRole = await applyInheritance(accessControl, _currentRole)
    console.log(currentRole)

    const subject = currentRole?.capabilities?.[resourceName]
    if( subject?.blacklist?.includes(functionName) ) {
      return false
    }

    const allowedInToken = !acProfile.allowed_functions || (
      acProfile.allowed_functions.includes(`${resourceName}@${functionName}`)
    )

    const result = allowedInToken
      && (!currentRole.forbidEverything || subject?.functions?.includes(functionName))
      && (
        currentRole?.grantEverything
        || subject?.grantEverything
        || subject?.functions?.includes(functionName)
      )

    if( result ) {
      return true
    }

    return false
  }
}
