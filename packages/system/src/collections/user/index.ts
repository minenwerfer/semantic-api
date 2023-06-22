import description from './description'
import model from './model'
import authenticate from './authenticate'
import insert from './insert'
import ping from './ping'

export default () => ({
  description,
  model,
  functions: {
    authenticate,
    insert,
    ping
  }
})
