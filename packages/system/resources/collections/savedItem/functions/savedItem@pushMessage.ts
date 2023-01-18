import type { ApiFunction } from '../../../../../api/types'
import type { Message } from '../../message/message.description'

type Props = {
  item: string
  message: Partial<Message>
}

const unsubscribe: ApiFunction<Props> = async (props, context) => {
  context.validate(
    props.message,
    ['title', 'content'],
    context.descriptions.message
  )

  const message = await context.collections.message.insert({
    what: props.message
  })

  return context.model.updateOne(
    { item: props.item },
    {
      $addToSet: {
        messages: message._id
      }
    }
  )
}

export default unsubscribe

