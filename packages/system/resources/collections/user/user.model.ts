import * as bcrypt from 'bcrypt'
import { createModel } from '../../../api/core/collection'
import UserDescription from './user.description'

export default createModel(UserDescription, {
  schemaCallback: (schema) => { 
    schema.virtual('first_name').get(function() {
      return this.full_name?.split(' ')[0] || 'N/A'
    })

    schema.virtual('last_name').get(function() {
      return this.full_name?.split(' ').slice(1).join(' ') || 'N/A'
    })

    schema.methods.testPassword = function(candidate: string) {
      return this.password
        ? bcrypt.compare(candidate, this.password)
        : false
    }
  }
})
