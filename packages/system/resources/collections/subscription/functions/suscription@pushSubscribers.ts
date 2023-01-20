import type { ApiFunction } from '../../../../../api/types'

type Props = {
  _id: string
  subscribers: Array<string>
}

const pushSubscribers: ApiFunction<Props> = async (props, context) => {
  return context.model.findOneAndUpdate(
    { _id: props._id },
    {
      $addToSet: {
        subscribers: {
          $each: props.subscribers
        }
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

export default pushSubscribers

