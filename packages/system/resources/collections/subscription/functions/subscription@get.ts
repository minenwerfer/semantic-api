import type { ApiFunction } from '../../../../../api/types'
import type { Subscription } from '../subscription.description'

const get: ApiFunction<any> = async (props, context) => {
  const subscription = await context.collection.get(props) as Subscription

  if( subscription.messages?.length ) {
    await context.collections.subscriptionMessage.model().updateMany({
      _id: {
        $in: subscription.messages.map(message => (message as any)?._id)
      }
    }, {
      $addToSet: {
        viewers: context.token.user._id
      }
    })
  }
  
  return subscription
}

export default get

