import type { Context } from '@semantic-api/api'
import { Token, makeException } from '@semantic-api/api'
import { description, type User } from './description'

type Props = {
  email: string
  password: string
}

type Return = {
  user: Pick<User,
    'first_name'
    | 'last_name'
    | 'email'
    | 'roles'
    | 'active'
  >
  token: {
    type: 'bearer'
    token: string
  }
}

const authenticate = async (props: Props, context: Context<typeof description, any, any>) => {
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
    return makeException({
      name: 'AuthenticationError',
      message: 'AuthenticationError.invalid_credentials'
    })
  }

  if( !user.active ) {
    return makeException({
      name: 'AuthenticationError',
      message: 'AuthenticationError.inactive_user'
    })
  }

  const { _password, ...leanUser } = await context.model
    .findOne({ email: user.email })
    .lean({
      autopopulate: true,
      virtuals: true
    })

  const tokenContent = {
    user: {
      _id: leanUser._id,
      roles: leanUser.roles
    },
  }

  if( context.apiConfig.logSuccessfulAuthentications ) {
    context.log('successful authentication', {
      email: leanUser.email,
      roles: leanUser.roles,
      _id: user._id
    })
  }

  if( context.apiConfig.tokenUserProperties ) {
    const pick = (obj: any, properties: Array<string>) => properties.reduce((a, prop) => {
      if( 'prop' in obj ) {
        return a
      }

      return {
        ...a,
        [prop]: obj[prop]
      }
    }, {})

    Object.assign(tokenContent.user, pick(leanUser, context.apiConfig.tokenUserProperties))
  }

  const token = await Token.sign(tokenContent) as string

  return {
    user: leanUser,
    token: {
      type: 'bearer',
      token
    }
  } as Return
}

export default authenticate
