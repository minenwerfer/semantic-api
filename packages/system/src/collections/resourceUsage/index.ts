import { defineCollection } from '@semantic-api/api'
import { description, ResourceUsage } from './description'

export default defineCollection(() => ({
  item: ResourceUsage,
  description
}))
