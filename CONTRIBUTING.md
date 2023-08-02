# Contribution Guide

## No collateral effects

Write this:

```typescript
const transform = (source: object) => {
  const target = Object.assign({}, source)
  target.someProp = true
  return target
}
```

Instead of:

```typescript
const transform = (source: object) => {
  source.someProp = true
}
```

Or even:

```typescript
// this is also wrong because source is still being mutated
const transform = (source: object) => {
  source.someProp = true
  return souce
}
```

## No uneeded type annotations

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
