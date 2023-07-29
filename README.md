# Semantic API

## Introduction

Semantic API is a **REST framework** that focuses on developer experience and simplicity.

<!-- The following is an excerpt from O'Reilly's book [RESTful Web Services](https://www.oreilly.com/library/view/restful-web-services/9780596529260/ch04.html): -->

<!-- >A resource is anything that's important enough to be referenced as a thing in itself. If your users might "want to create a hyperlink to it, make or refute assertions about it, retrieve or cache a representation of it, include all or part of it by reference into another representation, anotate it, or perform other operations on it", then you should make it a resource. […] A resource may be a physical object like an apple, or an abstract concept like courage […] -->

<!-- In semantic-api the "physical objects" are referred as "collections" and are always things that are stored on databases, whereas the "abstract concepts" are groups of endpoints that execute logic on a certain context called "algorithms". -->


## Features

- World class developer experience using the latest TypeScript features
- Out of the box authentication, file management, logging, rate limiting & more
- Every use case can be trivially accessed for scripting and unit testing
- Output your entire API as a single auto-executable JS file
- Tiny dependency graph


## Quick start

Semantic API lets you define your API resources using a `JSON schema` superset called `Description`. The `defineDescription` function is strongely typed, and thanks to the latest TypeScript releases we can catch unintended choices such as setting an unexisting property as required. Trying to define a property that doesn't follow default casing will also result in a TS error.

```typescript
import { defineDescription } from '@semantic-api/api'

const [Pet, description] = defineDescription({
  $id: 'pet',
  required: [
    'name'
    // The below would produce TS diagnostics since 'age' does not exist on
    // keyof TDescription['properties'].
    // 'age'
  ],
  properties: {
    name: {
      type: 'string'
    },
    species: {
      type: 'array',
      items: {
        enum: [
          'dog',
          'cat',
          'bird'
        ]
      }
    },
    picture: {
      $ref: 'file'
    }
    // Below would also produce TS diagnostics since 'camelCase' is not
    // assignable to Lowercase<string>.
    // camelCase: {
    //   type: 'string'
    // }
  }
})

const pet: Pet = {
  name: 'Thor',
  // error! "'dogx'" is not assignable to "'dog' | 'cat' | 'bird'"
  // species: 'dogx'
}

export default () => ({
  item: Pet,
  description,
  functions: {}
})
```

Next thing upon creating a collection is adding functions to it. That is, CRUD operations, actual business logic, you name it. Semantic API endpoint functions are standardized as two-parameter functions that resolve a JSON-serializable object or a `Response` object. Instead of the traditional `function (req, res, next): void` we have a "payload" parameter that represents the HTTP request body, and a "context" parameter which is a strongely typed object that contains every API resource.

```typescript
import type { description } from './description'

const get = (name: string, context: Context<typeof description>) => {
  // We use Mongoose as a ODM, so context.model will be a typeof import('mongoose').Model<T>.
  const pet = await context.model.findOne({ name }).lean()

  console.log(pet.name)
  // The below would produce TS diagnostics since 'age' property doesn't exist
  // on Pet.
  console.log(pet.age)

  return pet
}
```

You have your resources set up, now you have to handle the access to them. Semantic API comes with Authentication and RBAC (Role-based Access Control) out of the box, so this can easily be done (and typed) in a monolithic and declarative fashion instead of having middlewares.

```typescript
import { defineAccessControl } from '@semantic-api/access-control'

export const accessControl = defineAccessControl<Collections, Algorithms>()({
  roles: {
    guest: {
      inherit: [
        'unauthenticated',
        // The below would throw because you can't inherit from an unexisting role.
        // 'unexisting_role'
      ],
      capabilities: {
        pet: {
          functions: [
            'get',
            // The below would also produce TS diagnostics because thanks to
            // the autogenerated declaration file we know that the Pet collection
            // hasn't such function.
            // 'unexisting_function'
          ]
        }
      },
    },
  },
})()
```

Now you just have to put it all together and start listening on a webserver. You could use your own, but Semantic API ships its own made on top of Hapi for convenience. Being like that all the server layer is compatible with Hapi.

```typescript
import { initWithDatabaseThenStart } from '@semantic-api/server'
import pet from './collections/pet'

// Motice how for the sake of typing we don't pass our config down to the API
// through a function parameter. Instead, we export them from the endpoint so the
// types can be recovered globally.
export { accessControl } from './infrastructure/accessControl'

// You could even declare your collections inline here.
export const collections = {
  pet
}

// As we don't provided a `MONGODB_URI` environment variable Semantic API will
// start a runtime-only database.
initWithDatabaseThenStart()
```

## Leveling up

- [Official documentation](https://semantic-api.github.io/docs/)
- [Examples](https://github.com/ringeringeraja/semantic-api/tree/master/examples)
- [Contributing Guide](https://github.com/ringeringeraja/semantic-api/tree/master/CONTRIBUTING.md)

## License

Semantic API is [MIT licensed](https://github.com/ringeringeraja/semantic-api/tree/master/LICENSE.md).
