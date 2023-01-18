import type { ApiFunction } from '../../../../../api/types'

const getAll: ApiFunction<null> = (_props, context) => {
  return context.model
    .find({ subscribers: context.token.user._id })
    .lean({ autopopulate: true })
}

export default getAll

