import type { ApiFunction } from '@semantic-api/api'
import { serialize } from '@semantic-api/common'

type Props = {
  noSerialize?: boolean
}

const describeAll: ApiFunction<Props, typeof import('../meta.library')> = (props, context) => {
  const descriptions = context.library.getDescriptions(context)
  const result =  {
    descriptions,
    roles: context.accessControl.roles
  }

  if( props?.noSerialize ) {
    return result
  }

  return context.h
    .response(serialize(result))
    .header('content-type', 'application/bson')
}

export default describeAll
