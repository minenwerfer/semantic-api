import type { ApiContext } from '../types/function'
import { getResourceAsset } from './assets'
import { makeException } from './exceptions'

export const rateLimit = async (context: ApiContext, limit: number) => {
  const UserModel = getResourceAsset('user', 'model')
  const ResourceUsage = getResourceAsset('resourceUsage', 'model')

  const user = await UserModel.findOne(
    { _id: context.token?.user._id },
    { resources_usage: 1 }
  )

  if( !user ) {
    throw makeException({
      name: 'RateLimitError',
      message: 'user not found'
    })
  }

  console.log(user)

  const r = await ResourceUsage.create({
    scale: 1,
    limit: 2
  })

  const x = await UserModel.updateOne(
    { _id: user._id },
    {
      $set: {
        [`resources_usage.${context.functionPath}`]: r._id
      }
    }
  )

  console.log(x)
  console.log(context.functionPath)
}
