import * as R from 'ramda'
import type { Model } from 'mongoose'
import type { Description } from '../../../types'
import type { ApiContextWithAC, MongoDocument } from '../../types'
import type { GetAllProps, Projection, CollectionFunctions } from './functions.types'
import { fromEntries } from '../../../common/helpers'
import { checkImmutability } from '../accessControl/layers'
import { makeException } from '../exceptions'
import { normalizeProjection, fill, prepareInsert } from './utils'

const DEFAULT_SORT = {
  date_updated: -1,
  date_created: -1,
  created_at: -1,
}

const LEAN_OPTIONS = {
  autopopulate: true,
  getters: true,
  virtuals: true
}

export default <T extends MongoDocument>(
  model: Model<T>,
  description: Description,
  _context: ApiContextWithAC|null
) => {
  const context = _context||{} as ApiContextWithAC
  const {
    acFunctions: {
      beforeRead,
      beforeWrite
    }
  } = context
  
  const _insert = async (props: {
    what: Partial<T>
    project?: Projection<T>
  }) => {
    const { _id } = props.what
    const { what } = await beforeWrite(props, context)
    const readyWhat = prepareInsert(what, description)
    const projection = props.project
      && normalizeProjection(props.project, description)

    if( !_id ) {
      const newDoc = await model.create(readyWhat)
      return model.findOne({ _id: newDoc._id }, projection)
        .lean(LEAN_OPTIONS)
    }

    const options = {
      new: true,
      runValidators: true,
      projection
    }

    return model.findOneAndUpdate({ _id }, readyWhat, options)
      .lean(LEAN_OPTIONS)
  }

  const _getAll = async (props: GetAllProps<T>) => {
    if( typeof props.limit !== 'number' ) {
      props.limit = +(process.env.PAGINATION_LIMIT||35)
    }

    const entries = Object.entries(props.filters||{})
      .map(([key, value]) => [
        key,
        value && typeof value === 'object' && 'id' in value ? value._id : value
      ])

    const filters = fromEntries(entries) || {}
    const query = await beforeRead({ filters }, context)

    const sort = query.sort
      ? query.sort
      : props.sort || DEFAULT_SORT

    return model.find(query.filters, normalizeProjection(props.project, description))
      .sort(sort)
      .skip(props.offset || 0)
      .limit(props.limit)
      .lean(LEAN_OPTIONS)
  }

  const functions: CollectionFunctions<T> & {
    context: () => ApiContextWithAC
  } = {
    context: () => context,
    async insert(props) {
      const result = await _insert(props)
      if( result ) {
        return fill(result, description)
      }
    },

    async get(props) {
      if( !props?.filters ) {
        throw new Error('no filter specified')
      }

      const pipe = R.pipe(
        (item) => {
          if( !item ) {
            throw makeException({
              name: 'ItemNotFound',
              message: 'item wasnt found'
            })
          }

          return item
        },
        (item) => fill(item, description),
      )

      const result = await model.findOne(
        props.filters,
        normalizeProjection(props.project, description)

      ).lean(LEAN_OPTIONS)

      if( !result ) {
        return null
      }

      return pipe(result as T)
    },

    async getAll(props) {
     const result = await _getAll(props||{})
     return result.map((item) => {
       if( item ) {
         return fill(item, description)
       }
     })
    },

    async delete(props) {
      if( !props.filters ) {
        throw new Error('no criteria specified')
      }
      
      const query = await beforeRead(props, context)
      return model.findOneAndDelete(query.filters, { strict: 'throw' })
    },

    async deleteAll(props) {
      if( !Array.isArray(props.filters?._id) || props.filters?._id?.length === 0 ) {
        throw new Error('no criteria specified')
      }

      const { _id, ...rest } = props.filters
      const filters = {
        _id: { $in: props.filters._id },
        ...rest
      }

      const query = await beforeRead({ filters }, context)
      return model.deleteMany(query.filters, { strict: 'throw' })
    },

    async modify(props) {
      const { what, filters } = await beforeWrite(props, context)
      const readyWhat = prepareInsert(what, description)

      return model.findOneAndUpdate(filters, readyWhat, { new: true, runValidators: true })
    },

    async modifyAll(props) {
      const { what, filters } = await beforeWrite(props, context)
      const readyWhat = prepareInsert(what, description)

      return model.updateMany(filters.filters, readyWhat)
    },

    async count(props) {
      const query = await beforeRead(props, context)
      const count = await model.countDocuments(query.filters) as unknown
      return count as number
    },

    async upload(_props) {
      const {
        propertyName,
        parentId,
        ...props

      } = _props

      await checkImmutability(
        context, {
          propertyName,
          parentId,
          childId: props.what._id as string,
          payload: props
        }
      )

      const file = await context.collections.file.insert(props)
      const payload = context.description.properties[propertyName].type === 'array'
        ? { $addToSet: { [propertyName]: file._id } }
        : { $set: { [propertyName]: file._id } }

      await context.model.updateOne(
        { _id: parentId },
        payload
      )

      return file
    },

    async deleteFile(_props) {
      const {
        propertyName,
        parentId,
        ...props

      } = _props

      if( !parentId ) {
        throw new TypeError('no parentId')
      }

      await checkImmutability(
        context, {
          propertyName,
          parentId,
          childId: props.filters._id,
          payload: props
        }
      )

      return context.collections.file.delete(props)
    }
  }

  return functions
}
