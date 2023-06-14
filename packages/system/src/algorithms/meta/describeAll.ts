import type { ApiContext } from '@semantic-api/api'
import { serialize } from '@semantic-api/common'
import { getDescriptions } from './library'

type Props = {
  noSerialize?: boolean
}

const describeAll = (props: Props, context: ApiContext): any => {
  const descriptions = getDescriptions(context)
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
