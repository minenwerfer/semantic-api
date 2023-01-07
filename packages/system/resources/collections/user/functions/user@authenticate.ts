import { TokenService } from '../../../../../api/core/token'
import type { ApiFunction } from '../../../../../api/types'
import type { User } from '../user.description'
import UserModel from '../user.model'

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

const authenticate: ApiFunction<Props, typeof import ('../user.library')> = async (props, context): Return => {
  if( !props.email ) {
    throw new Error('Empty email or password')
  }

  if(
    props.email === process.env.GODMODE_USERNAME
  && props.password === process.env.GODMODE_PASSWORD
  ) {
    const token = await TokenService.sign({
      user: {
        _id: null,
        roles: ['root']
      },
    }) as string

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

  const user = await UserModel.findOne({ email: props.email }).select('+password')
  if( !user || !await user.testPassword!(props.password) ) {
    throw new Error('invalid username or password')
  }

  const { password, ...leanUser } = user.toObject()
  if( !user.active ) {
    throw new Error('this user is inactive')
  }

  context.log('successful authentication', {
    email: user.email
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

  if( context.apiConfig?.populateUserExtra ) {
    const UserExtra = context.library.userExtraModel()
    const projection = context.apiConfig.populateUserExtra
      .reduce((a, f) => ({ ...a, [f]: 1 }), {})

    const userExtra = await UserExtra
      .findOne({ owner: leanUser._id }, projection)
      .lean()

    tokenContent.extra = userExtra
    response.extra = userExtra
  }


  const token = await TokenService.sign(tokenContent) as string

  return {
    ...response,
    token: {
      type: 'bearer',
      token
    }
  }
}

export default authenticate
