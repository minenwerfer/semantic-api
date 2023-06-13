import { deepMerge } from '@semantic-api/common'
import type { ApiFunction, ApiContext } from '@semantic-api/server'
import type { Description } from '@semantic-api/types'
import * as baseControl from './baseLayers'

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

  const beforeRead: ApiFunction<any> = async (props, context): Promise<ReadPayload> => {
    const payload = Object.assign({}, {
      filters: props?.filters||{},
      sort: props?.sort,
      limit: props?.limit
    })

    if( options.queryPreset ) {
      deepMerge(
        payload,
        options.queryPreset
      )
    }

    if( accessControl.layers?.read && context.token ) {
      await accessControl.layers?.read(context, { payload })
    }

    await baseControl.read!(context, { payload })

    if( payload.limit > 150 ) {
      payload.limit = 150
    }

    return payload
  }

  const beforeWrite: ApiFunction<any> = async (props, context): Promise<WritePayload> => {
    const payload = Object.assign({ what: {} }, props)

    if( accessControl.layers?.write && context.token ) {
      await accessControl.layers?.write(context, { payload })
    }

    await baseControl.write!(context, { payload })
    return payload
  }

  return {
    beforeRead,
    beforeWrite
  }
}
