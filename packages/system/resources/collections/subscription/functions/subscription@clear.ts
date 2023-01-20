import { Types } from 'mongoose'
import type { ApiFunction } from '../../../../../api/types'

const clear: ApiFunction<null> = (_props, context) => {
  return context.model.updateMany(
    { subscribers: context.token.user._id },
    {
      $pull: {
        subscribers: new Types.ObjectId(context.token.user._id as string)
      }
    }
  )
}

export default clear

