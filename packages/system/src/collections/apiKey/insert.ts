import { Token, type Context } from '@semantic-api/api'
import { description, type ApiKey } from './description'

type Props = {
  what: Partial<ApiKey>
}

const insert = async (props: Props, context: Context<typeof description>) => {
  if( props.what._id ) {
    return context.collection.insert(props)
  }

  context.validate(description, props?.what, {
    required: [
      'name',
      'allowed_functions'
    ]
  })

  props.what.content = '/'

  const key_id = (await context.collection.insert({
    what: {
      ...props.what,
      owner: context.token.user._id
    },
    project: [
      '_id'
    ]
  }))._id

  const content = await Token.sign({
    user: context.token.user,
    extra: context.token.extra,
    allowed_functions: props.what.allowed_functions,
    key_id,
    key_name: props.what.name
  }, null, {})

  return context.model.findOneAndUpdate(
    { _id: key_id },
    { $set: { content } },
    {
      new: true,
      runValidators: true
    }
  )
}

export default insert
