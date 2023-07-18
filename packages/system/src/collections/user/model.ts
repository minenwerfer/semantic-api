import * as bcrypt from 'bcrypt'
import { createModel } from '@semantic-api/api'
import { description } from './description'

export default () => createModel(description, {
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
