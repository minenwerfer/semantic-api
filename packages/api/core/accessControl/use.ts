import { deepMerge } from '../../../common/helpers'
import type { ApiFunction, ApiContext } from '../../types'
import type { Description } from '../../../types'
import * as baseControl from './baseControl'

type ReadPayload = {
  filters: Record<string, any>
  sort: Record<string, any>
  limit: number
}

type WritePayload = {
  what: Record<string, any>
  filters: Record<string, any>
}

export const useAccessControl = (description: Description, context?: ApiContext) => {
  const options = description.options
    ? Object.assign({}, description.options)
    : {}

  const accessControl = context?.accessControl||{}

  const beforeRead: ApiFunction<any> = (props, context): ReadPayload => {
    const newPayload = Object.assign({}, {
      filters: props?.filters||{},
      sort: props?.sort,
      limit: props?.limit
    })

    if( options.queryPreset ) {
      deepMerge(
        newPayload,
        options.queryPreset
      )
    }

    if( accessControl.beforeRead && context.token ) {
      deepMerge(
        newPayload,
        accessControl.beforeRead(newPayload, context)
      )
    }

    deepMerge(
      newPayload,
      baseControl.beforeRead!(newPayload, context)
    )

    if( newPayload.limit > 150 ) {
      newPayload.limit = 150
    }

    return newPayload
  }

  const beforeWrite: ApiFunction<any> = (props, context): WritePayload => {
    const newPayload = Object.assign({ what: {} }, props)

    if( accessControl.beforeWrite && context.token ) {
      deepMerge(
        newPayload,
        accessControl.beforeWrite(newPayload, context)
      )
    }

    deepMerge(
      newPayload,
      baseControl.beforeWrite!(newPayload, context)
    )

    return newPayload
  }

  return {
    beforeRead,
    beforeWrite
  }
}
