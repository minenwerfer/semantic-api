import type { ApiFunction } from '../../../../../api/types'

const describeAll: ApiFunction<null, typeof import('../meta.library')> = (_props, context) => {
  const descriptions = context.library.getDescriptions(context)
  return {
    descriptions,
    roles: context.accessControl.roles
  }
}

export default describeAll
