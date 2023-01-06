import { Types } from '../../../api/core/database'
import { useCollection, getResourceAsset } from '../../../api'
import type { ApiFunction } from '../../../api/types'
import type { User } from './user.description'

type SaveWithExtraProps = {
  what: Partial<User> & {
    extra: Record<string, any>
  }
}

export const userExtraModel = () => {
  return getResourceAsset('userExtra', 'model')
}

export const saveWithExtra: ApiFunction<SaveWithExtraProps, Promise<Partial<User>>> = async (props, context) => {
  const { collection } = context
  const { extra } = props.what

  const UserExtra = userExtraModel()
  const userExtra = new UserExtra({
    ...extra,
    owner: new Types.ObjectId()
  })

  await userExtra.validate()
  const user = await collection.insert(props)

  useCollection('userExtra', context).insert({
    what: {
      ...extra,
      owner: user._id
    }
  })

  return user
}
