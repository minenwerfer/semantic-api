import description from './pet.description'

export default {
  description,
  functions: {
    bark: (person: string) => `Bark! *Bites ${person}`,
    performTrick: (times: number) => `*sits ${times}x*`
  },
} as const
