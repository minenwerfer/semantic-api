import type { ApiFunction } from '../../../../../api/types'
import type { SubscriptionMessage } from '../../subscriptionMessage/subscriptionMessage.description'
import type { Subscription } from '../subscription.description'

type Props = {
  _id: string
  item: Subscription
  message: Partial<SubscriptionMessage>
}

const pushMessage: ApiFunction<Props> = async (props, context) => {
  if( !props._id ) {
    context.validate(props.item, [
      'title',
      'description',
      'route',
      'identifier'
    ])
  }

  context.validate(
    props.message,
    [
      'content'
    ],
    context.descriptions.subscriptionMessage
  )

  const message = await context.collections.subscriptionMessage.insert({
    what: {
      ...props.message,
      owner: context.token.user._id,
      viewers: [
        context.token.user._id
      ]
    }
  })

  return context.model.findOneAndUpdate(
    {
      $or: [
        { _id: props._id },
        { identifier: props.item.identifier }
      ]
    },
    {
      $addToSet: {
        messages: message._id,
        subscribers: context.token.user._id
      },
      $setOnInsert: {
        title: props.item.title,
        description: props.item.description,
        identifier: props.item.identifier,
        route: props.item.route,
        owner: context.token.user._id
      }
    },
    {
      new: true,
      runValidators: true,
      upsert: true
    }
  ).lean({
    autopopulate: true,
    virtuals: true
  })
}

export default pushMessage

