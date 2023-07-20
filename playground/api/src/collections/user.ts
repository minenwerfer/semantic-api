import { defineDescription, createModel, type Schema } from '@semantic-api/api'
import { deepMerge } from '@semantic-api/common'
import user, { userSchemaCallback } from '@semantic-api/system/collections/user/index.js'

const newDescription = <const>{
  required: [
    'favorite_color'
  ],
  properties: {
    favorite_color: {
      enum: [
        'blue',
        'red',
        'yellow'
      ]
    },
  }
}

const [NewUser] = defineDescription(newDescription)

export type User = Awaited<ReturnType<typeof user>>['item'] & typeof NewUser

export default async () => {
  const userCollection = await user()
  const description = userCollection.description as typeof userCollection['description'] & typeof newDescription

  Object.assign(
    description,
    deepMerge(description, newDescription)
  )

  return {
    item: {} as Schema<typeof description>,
    description,
    functions: userCollection.functions,
    model: () => {
      return createModel(description, {
        schemaCallback: userSchemaCallback as any
      })
    }
  }
}
