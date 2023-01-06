import { AccessControl } from '../../types'

export const beforeRead: AccessControl['beforeRead'] = (_payload, _context) => {
  const preset: any = {}
  return preset
}

export const beforeWrite: AccessControl['beforeWrite'] = (_payload, { resourceName, token }) => {
  const preset: any = {}

  if( !token?.user?.roles.includes('root') ) {
    return preset
  }

  if( resourceName === 'userExtra' ) {
    preset.owner = token?.user._id
  }

  return preset
}
