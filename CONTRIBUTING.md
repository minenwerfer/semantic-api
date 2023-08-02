# Contribution Guide

## Style guidelines

Here's some text editor configuration you want to setup before contributing:

- Set 2 spaces as indent (your text editor should just map tab to spaces)
- Plugins for typehints and autocompletion

### No collateral effects

Write this:

```typescript
const transform = (source: T) => {
  const target = Object.assign({}, source)
  target.someProp = true
  return target
}
```

Instead of:

```typescript
const transform = (source: T) => {
  source.someProp = true
}
```

Or even:

```typescript
// this is also wrong because source is still being mutated
const transform = (source: T) => {
  source.someProp = true
  return souce
}
```

Also don't add properties on `globalThis`, use another approach like dynamically importing.


### No uneeded type annotations

Write this:

```typescript
const name = 'Semantic API'

const someFn = () => {
  return 'some inferrable type'
}
```

Instead of:

```typescript
const name: string = 'Semantic API'

const someFn = (): string => {
  return 'some inferrable type'
}
```


### Use conventions for TypeScript names

Write this:

```typescript
const someFn = <TPerson extends Person>(person: TPerson) => person
```

Instead of:

```typescript
const someFn = <T>(person: T) => person
```


### No classes

Give preference to the object notation. If your object doesn't reference `this` anywhere and you are just using classes to fit functions together then you should probably just export these functions separately.

Write this:

```typescript
const makePerson = <TName extends string>(name: TName) => (<const>{
  name,
  hello() {
    console.log(this.name)
  }
})
```

Instead of:

```typescript
class Person {
  constructor(private name: str) {
  }

  hello() {
    console.log(this.name)
  }
}
```

### Don't use computed properties without necessity

You may still use them, but only when is there some actual computation going on.
Those are generally rare.

Write this:

```typescript
const pet = {
  name: 'Thor',
  specie: 'dog'
}

pet.name = 'Bobby'
```

Instead of:

```typescript
// computed propreties have completely no use in this example
// it is just making the code more verbose

const pet = {
  _name: 'Thor',
  get name() {
    return this._name
  },
  set name() {
    return this._name
  }
}

pet.name = 'Bobby'
```
