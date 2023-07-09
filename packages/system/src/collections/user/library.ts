import { Types } from 'mongoose'
import { getResourceAsset } from '@semantic-api/api'
import { isLeft, unwrapEither } from '@semantic-api/common'
import type { Context } from '@semantic-api/api'
import description, { type User } from './description'

type SaveWithExtraProps = {
  what: Partial<User> & {
    extra: Record<string, any>
  }
}

export const userExtraModel = async () => {
  const either = await getResourceAsset('userExtra' as any, 'model')
  if( isLeft(either) ) {
    const error = unwrapEither(either)
    throw error
  }

  return unwrapEither(either)
}

export const saveWithExtra = async (props: SaveWithExtraProps, context: Context<typeof description, any, any>): Promise<Partial<User>> => {
  const { collection } = context
  const { extra } = props.what

  const UserExtra = await userExtraModel()
  const userExtra = new UserExtra({
    ...extra,
    owner: new Types.ObjectId()
  })

  await userExtra.validate()
  const user = await collection.insert(props)

  try {
    await context.collections.userExtra.functions.insert({
      what: {
        ...extra,
        owner: user._id,
      }
    })
  } catch(e) {
    if( !props.what._id ) {
      await collection.delete({
        filters: {
          _id: user._id
        }
      })
    }

    throw e
  }

  return user
}
