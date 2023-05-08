import { left, right } from '@semantic-api/common'

export const success = <T>(result: T) => right({ result })

export const error = <const Message extends string>(message: Message) => left({ error: message })
