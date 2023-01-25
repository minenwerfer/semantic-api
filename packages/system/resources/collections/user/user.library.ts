import { Types } from '../../../../api/core/database'
import { getResourceAsset } from '../../../../api'
import type { ApiFunction } from '../../../../api/types'
import type { User } from './user.description'

type SaveWithExtraProps = {
  what: Partial<User> & {
    extra: Record<string, any>
  }
}

export const userExtraModel = () => {
  return getResourceAsset('userExtra', 'model')
}

export const saveWithExtra: ApiFunction<SaveWithExtraProps> = async (props, context): Promise<Partial<User>> => {
  const { collection } = context
  const { extra } = props.what

  const UserExtra = userExtraModel()
  const userExtra = new UserExtra({
    ...extra,
    owner: new Types.ObjectId()
  })

  await userExtra.validate()
  const user = await collection.insert(props)

  try {
    await context.collections.userExtra.insert({
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
