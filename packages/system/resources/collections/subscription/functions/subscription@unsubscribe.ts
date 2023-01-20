import { Types } from 'mongoose'
import type { ApiFunction } from '../../../../../api/types'
import type { SavedItem } from '../subscription.description'

type Props = Pick<SavedItem, 'identifier'>

const unsubscribe: ApiFunction<Props> = async (props, context) => {
  context.validate(props, ['identifier'])
  const result = await context.model.findOneAndUpdate(
    { identifier: props.identifier },
    {
      $pull: {
        subscribers: new Types.ObjectId(context.token.user._id as string)
      }
    },
    { new: true }
  )

  if( result.subscribers.length === 0 ) {
    context.resource.delete({
      filters: {
        _id: result._id
      }
    })
  }
}

export default unsubscribe

