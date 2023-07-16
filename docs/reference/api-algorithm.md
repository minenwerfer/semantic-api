# Algorithm

An algorithm is a type of resource that holds only a `functions` property.

```ts
export type Algorithm = () => {
  functions?: Record<string, (...args: any[]) => any>
}
```

## Declaration and use cases

To declare an algorithm simply provide a function that returns an object with a `functions` property. See more about functions [here](). For the sake of exemplification let's create a ficticious multimedia processing algorithm and call it `mediaProcessing`:

```ts
export default () => ({
    functions: {
        processImage: (payload: ImageProcessingPayload, context: Context) => {
            // do some kind of work
        },
        processVideo: (payload: VideoProcessingPayload, context: Context) => {
            // same as above but with a video instead
        },
    }
})
```

Now we have a set of functions that lives under the `mediaProcessing` algorithm. If we wanted to add some kind of rate limiting on both functions we could do that easily:

```ts
export const accessControl: AccessControl<Collections, Algorithms> = {
    roles: {
        guest: {
            capabilities: {
                imageProcessing: {
                    grantEverything: true
                }
            }
        }
    },
    layers: {
        async call({ resourceName }, context) {
            await context.limitRate({
                // ...
            })
        }
    }
}
```
