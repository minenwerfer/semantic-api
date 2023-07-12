export const SV_API_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:3000/api'
  : '/api'

/**
 * Those are for runtime validation.
 * Please keep it like that.
 */

export const PAGINATION_PER_PAGE_LIMIT = 150
export const PAGINATION_PER_PAGE_DEFAULTS = [
  10,
  35,
  100,
  150
]

export const PAGINATION_PER_PAGE_DEFAULT = 10

export const PROPERTY_TYPES = [
  'string',
  'integer',
  'number',
  'boolean',
  'object',
  'array'
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

