export const SV_API_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:3000/api'
  : '/api'

export const PAGINATION_PER_PAGE_LIMIT = 150

export const PROPERTY_TYPES = [
  'string',
  'integer',
  'number',
  'boolean',
  'object',
  'array',
  'time',
  'month'
] as const

export const PROPERTY_FORMATS = [
  'date',
  'date-time'
] as const

export const COLLECTION_PRESETS = [
  'crud',
  'duplicate',
  'delete',
  'deleteAll',
  'owned',
  'toggleActive',
  'view',
] as const

export const STORE_EFFECTS = {
  'ITEM_SET': 'setItem',
  'ITEM_INSERT': 'insertItem',
  'ITEMS_SET': 'setItems',
  'ITEMS_UPDATE': 'updateItems',
  'ITEM_REMOVE': 'removeItem',
}

