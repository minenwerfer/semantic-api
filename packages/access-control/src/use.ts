import { deepMerge } from '@semantic-api/common'
import type { Context } from '@semantic-api/api'
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

export const useAccessControl = <TDescription extends Description>(context: Context<TDescription, any, any>) => {
  const options = context.description.options
    ? Object.assign({}, context.description.options)
    : {}

  const accessControl = context?.accessControl||{}

  const beforeRead = async <Payload extends Partial<ReadPayload>>(payload: Payload, context: Context<any, any, any>): Promise<ReadPayload> => {
    const newPayload = Object.assign({}, {
      filters: payload?.filters||{},
      sort: payload?.sort,
      limit: payload?.limit
    }) as ReadPayload

    if( options.queryPreset ) {
      deepMerge(
        newPayload,
        options.queryPreset
      )
    }

    if( accessControl.layers?.read && context.token ) {
      await accessControl.layers?.read(context, { payload: newPayload })
    }

    await baseControl.read!(context, { payload: newPayload })

    if( newPayload.limit > 150 ) {
      newPayload.limit = 150
    }

    return newPayload
  }

  const beforeWrite = async <Payload extends Partial<WritePayload>>(payload: Payload, context: Context<any, any, any>): Promise<WritePayload> => {
    const newPayload = Object.assign({ what: {} }, payload) as unknown as WritePayload

    if( accessControl.layers?.write && context.token ) {
      await accessControl.layers?.write(context, { payload: newPayload })
    }

    await baseControl.write!(context, { payload: newPayload })
    return newPayload
  }

  return {
    beforeRead,
    beforeWrite
  }
}
