import { Types } from '@semantic-api/api/database'
import { getResourceAsset } from '@semantic-api/api'
import type { ApiFunction } from '@semantic-api/api'
import type { User } from './user.description'

type SaveWithExtraProps = {
  what: Partial<User> & {
    extra: Record<string, any>
  }
}

export const userExtraModel = async () => {
  return getResourceAsset('userExtra', 'model')
}

export const saveWithExtra: ApiFunction<SaveWithExtraProps> = async (props, context): Promise<Partial<User>> => {
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
    await context.collections.userExtra.insert<User>({
      what: {
        ...extra,
        owner: user._id
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
