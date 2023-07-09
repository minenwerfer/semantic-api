import { getResources, type Context } from '@semantic-api/api'
import { serialize } from '@semantic-api/common'

type Props = {
  noSerialize?: boolean
}

const describeAll = async (props: Props, context: Context<any, any>): Promise<any> => {
  const resources = await getResources()
  const descriptions = Object.fromEntries(
    Object.values(resources.collections as any[])
        .map(({ description }) => [description.$id, description])
  )

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
