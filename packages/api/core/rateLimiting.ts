import type { ApiContext } from '../types/function'
import { makeException } from './exceptions'
import { mongoose } from './database'

export type RateLimitingParams = {
  limit?: number
  scale?: number
  increment?: number
}

const rateLimitingError = (message: string) => makeException({
  name: 'RateLimitingError',
  message,
  httpCode: 429
})

export const limitRate = async (context: ApiContext, params: RateLimitingParams) => {
  const UserModel = mongoose.models.user
  const ResourceUsageModel = mongoose.models.resourceUsage

  const user = await UserModel.findOne(
    { _id: context.token?.user._id },
    { resources_usage: 1 }
  )

  if( !user ) {
    throw new (rateLimitingError('user not found'))
  }

  const increment = params.increment || 1
  const payload = {
    $inc: {
      hits: increment
    },
    $set: {}
  }

  const usage = user.resources_usage?.get(context.functionPath)
  if( !usage ) {
    const entry = await ResourceUsageModel.create({ hits: increment })
    return UserModel.updateOne(
      { _id: user._id },
      {
        $set: {
          [`resources_usage.${context.functionPath}`]: entry._id
        }
      }
    )
  }

  if( params.scale && (new Date().getTime()/1000 - usage.updated_at.getTime()/1000 < params.scale) ) {
    throw new (rateLimitingError('not so fast'))
  }

  if( params.limit && (usage.hits % params.limit === 0) ) {
    payload.$set = {
      last_maximum_reach: new Date()
    }
  }

  return ResourceUsageModel.updateOne(
    { _id: usage._id },
    payload
  )
}
