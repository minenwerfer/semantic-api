import type { ApiFunction } from '../../../../../api/types'

type Props = {
  _id: string
}

const pullMessage: ApiFunction<Props> = async (props, context) => {
  await context.collections.message.delete({
    filters: {
      _id: props._id
    }
  })

  return context.model.findOneAndUpdate(
    { messages: props._id },
    {
      $pull: {
        messages: props._id
      }
    },
    {
      new: true,
      runValidators: true,
      projection: {
        messages: 1
      }
    }
  ).lean({
    autopopulate: true,
    virtuals: true
  })
}

export default pullMessage

