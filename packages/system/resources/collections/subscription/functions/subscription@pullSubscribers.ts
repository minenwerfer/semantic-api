import type { ApiFunction } from '../../../../../api/types'

type Props = {
  _id: string
  subscribers: Array<string>
}

const pullSubscribers: ApiFunction<Props> = async (props, context) => {
  return context.model.findOneAndUpdate(
    { _id: props._id },
    {
      $pullAll: {
        subscribers: props.subscribers
      }
    },
    {
      new: true,
      runValidators: true,
      projection: {
        subscribers: 1
      }
    }
  ).lean({
    autopopulate: true,
    virtuals: true
  })
}

export default pullSubscribers

