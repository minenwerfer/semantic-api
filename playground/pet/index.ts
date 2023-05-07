import description from './pet.description'

export default {
  description,
  functions: {
    bark: (person: string) => console.log(`Bark! *Bites ${person}*`),
    performTrick: (times: number) => console.log(`*sits ${times}x*`)
  },
} as const
