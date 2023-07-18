import type { Schema, Context } from '@semantic-api/api'
import user from '@semantic-api/system/collections/user/index.js'

export default async () => {
  const userCollection = await user()
  const newDescription = <const>{
    indexes: [
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

  const description = userCollection.description as typeof userCollection['description'] & typeof newDescription
  Object.assign(description, newDescription)

  return {
    item: {} as Schema<typeof description>,
    description,
    model: userCollection.model,
    functions: {
      ...userCollection.functions,
      async test(_props: null, context: Context<typeof description, any, any>) {
        const randnum = Math.random().toString().slice(2)
        const colors = description.properties.favorite_color.enum

        await context.model.create({
          full_name: `User #${randnum}`,
          email: `${randnum}@mail.com`,
          favorite_color: colors[Math.floor(Math.random()*colors.length)],
          banana: 1
        })

        return context.collection.functions.getAll({}, context)
      }
    }
  }
}
