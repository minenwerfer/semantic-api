# Collection

A collection is a type of resource that holds a [`Description`]() and can also have a [`model`]() for database access.

```ts
export type CollectionStructure = {
  item: any
  description: Description
  model?: ReturnType<typeof createModel>
  functions?: Record<string, (...args: any[]) => any>
}

export type Collection = () => CollectionStructure|Promise<CollectionStructure>
```

## Declaring a collection

Collections are declared through a function that returns a `CollectionStructure` object. You may provide an async function. For example:

```ts
import { defineDescription } from '@semantic-api/api'

const [Pet, description] = defineDescription({
    $id: 'pet',
    properties: {
        name: {
            type: 'string'
        },
        favorite_toy: {
            enum: [
                'bone',
                'duck',
                'ball'
            ]
        }
    }
})

export default () => ({
    item: Pet,
    description
})
```

The above snippet will declare a valid collection whose model can be later used to access the database. To make it work simply import it in your application's entrypoint and then export it inside `collections`.
