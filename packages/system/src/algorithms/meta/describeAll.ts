import { getResources, type Context } from '@semantic-api/api'
import { serialize } from '@semantic-api/common'

type Props = {
  noSerialize?: boolean
}

const describeAll = async (props: Props, context: Context<any, any, any>): Promise<any> => {
  const resources = await getResources()

  const descriptions = Object.fromEntries(
    await Promise.all(Object.values(resources.collections as any[]).map(async (collection) => {
      const { description } = await collection()
      return [description.$id, description]
    }))
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
