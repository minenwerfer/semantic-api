import type { ApiFunction } from '../../../../../api/types'
import type { Message } from '../../message/message.description'
import type { SavedItem } from '../subscription.description'

type Props = {
  item: SavedItem
  message: Partial<Message>
}

const pushMessage: ApiFunction<Props> = async (props, context) => {
  context.validate(props.item, [
    'title',
    'description',
    'route',
    'identifier'
  ])

  context.validate(
    props.message,
    [
      'content'
    ],
    context.descriptions.message
  )

  const message = await context.collections.message.insert({
    what: {
      ...props.message,
      owner: context.token.user._id
    }
  })

  return context.model.findOneAndUpdate(
    { identifier: props.item.identifier },
    {
      $addToSet: {
        messages: message._id
      },
      $setOnInsert: {
        title: props.item.title,
        description: props.item.description,
        route: props.item.route,
        owner: context.token.user._id
      }
    },
    {
      new: true,
      runValidators: true,
      upsert: true,
      projection: {
        subscribers: 0
      }
    }
  ).lean({
    autopopulate: true,
    virtuals: true
  })
}

export default pushMessage

