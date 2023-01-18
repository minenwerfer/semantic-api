import type { ApiFunction } from '../../../../../api/types'
import type { SavedItem } from '../savedItem.description'

type Props = SavedItem

const subscribe: ApiFunction<Props> = async (props, context) => {
  context.validate(props, ['identifier'])
  try {
    const item = await context.resource.get({
      filters: {
        identifier: props.identifier
      },
      project: [
        '_id'
      ]
    })

    return context.model.findOneAndUpdate(
      { _id: item._id },
      {
        $addToSet: {
          subscribers: context.token.user._id
        }
      },
      {
        new: true,
        runValidators: true
      }
    )
  } catch( e ) {
  }

  return context.resource.insert({
    what: {
      ...props,
      owner: context.token.user._id,
      subscribers: [
        context.token.user._id
      ]
    }
  })
}

export default subscribe

