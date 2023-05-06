import description from './pet.description'

export default {
  description,
  functions: {
    bark: (person: string) => `Bark! *Bites ${person}`
  },
} as const
