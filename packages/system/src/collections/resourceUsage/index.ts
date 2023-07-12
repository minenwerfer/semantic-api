import { defineCollection } from '@semantic-api/api'
import description, { type ResourceUsage } from './description'

export default defineCollection(() => ({
  item: {} as ResourceUsage,
  description
}))
