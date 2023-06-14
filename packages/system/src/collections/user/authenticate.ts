import { Token, makeException } from '@semantic-api/api'
import type { ApiContext } from '@semantic-api/api'
import type { User } from './description'

import { userExtraModel } from './library'

type Props = {
  email: string
  password: string
}

type Return = Promise<{
  user: Pick<User,
    'first_name'
    | 'last_name'
    | 'email'
    | 'roles'
    | 'active'
  >
  extra: Record<string, any>
  token: {
    type: 'bearer'
    token: string
  }
}>

const authenticate = async (props: Props, context: ApiContext): Return => {
  if( !props?.email ) {
    throw new Error('Empty email or password')
  }

  if(
    props.email === process.env.GODMODE_USERNAME
  && props.password === process.env.GODMODE_PASSWORD
  ) {
    const token = await Token.sign({
      user: {
        _id: null,
        roles: ['root']
      },
    })

    return {
      user: {
        first_name: 'God',
        last_name: 'Mode',
        email: '',
        roles: ['root'],
        active: true,
      },
      extra: {},
      token: {
        type: 'bearer',
        token
      }
    }
  }

  const user = await context.model.findOne(
    { email: props.email },
    {
      email: 1,
      password: 1,
      active: 1
    }
  )

  if( !user || !await user.testPassword!(props.password) ) {
    throw new (makeException({
      name: 'AuthenticationError',
      message: 'AuthenticationError.invalid_credentials'
    }))
  }

  if( !user.active ) {
    throw new (makeException({
      name: 'AuthenticationError',
      message: 'AuthenticationError.inactive_user'
    }))
  }

  const { password, ...leanUser } = await context.model
    .findOne({ email: user.email })
    .lean({
      autopopulate: true,
      virtuals: true
    })

  context.log('successful authentication', {
    email: leanUser.email,
    roles: leanUser.roles,
    _id: user._id
  })

  const tokenContent = {
    user: {
      _id: leanUser._id,
      roles: leanUser.roles
    },
    extra: {}
  }

  const response = {
    user: leanUser,
    extra: {},
  }

  if( context.apiConfig.populateUserExtra ) {
    const UserExtra = await userExtraModel()
    const projection = context.apiConfig.populateUserExtra
      .reduce((a, f) => ({ ...a, [f]: 1 }), {})

    const userExtra = await UserExtra
      .findOne({ owner: leanUser._id }, projection)
      .lean() || {}

    tokenContent.extra = userExtra
    response.extra = userExtra
  }


  const token = await Token.sign(tokenContent) as string

  return {
    ...response,
    token: {
      type: 'bearer',
      token
    }
  }
}

export default authenticate
