import description from './user.description'
import model from './user.model'
import * as library from './user.library'

import authenticate from './functions/authenticate'
import insert from './functions/insert'
import ping from './functions/ping'

export default {
  description,
  model,
  library,
  functions: {
    authenticate,
    insert,
    ping
  }
}
