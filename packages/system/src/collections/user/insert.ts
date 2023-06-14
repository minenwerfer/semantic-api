import type { ApiContext } from '@semantic-api/api'
import * as bcrypt from 'bcrypt'
import { User } from './description'
import { saveWithExtra } from './library'

type Props = {
  what: Omit<Partial<User>, 'self_registered'> & {
    self_registered: true
    extra: Record<string, any>
  }
}

type Return = Promise<Partial<User>>

const insert = async (props: Props, context: ApiContext): Return => {
  const { token, collection, apiConfig } = context
  props.what.group = apiConfig.group

  // user is being inserted by a non-root user
  if( !token?.user?.roles.includes('root') ) {
    const userId = props.what._id = token?.user?._id
    delete props.what.roles

    // a new user is being created
    if( !userId ) {
      if( !apiConfig.allowSignup ) {
        throw new Error(
          `signup is not allowed`
        )
      }

      props.what.self_registered = true

      if( apiConfig.signupDefaults ) {
        Object.assign(props.what, apiConfig.signupDefaults)
      }
    }
  }

  if( !token?.user && !props.what.password ) {
    throw new Error(
      `password is required`
    )
  }

  if( props.what.password ) {
    props.what.password = await bcrypt.hash(props.what.password, 10)
  }

  if( props.what.password === null ) {
    delete props.what.password
  }

  return props.what.extra
    ? saveWithExtra(props, context)
    : collection.insert(props) as Promise<User>
}

export default insert
