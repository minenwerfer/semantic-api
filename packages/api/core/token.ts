import { promisify } from 'util'
import {
  Secret,
  SignOptions,
  sign,
  verify

} from 'jsonwebtoken'

const asyncSign = promisify<string|object|Buffer, Secret, SignOptions>(sign)
const asyncVerify = promisify<string, Secret, any>(verify)

declare namespace process {
  var env: {
    APPLICATION_SECRET: string
  }
}

export const { APPLICATION_SECRET } = process.env

/**
 * @exports @const
 * Expiration time in seconds.
 */
export const EXPIRES_IN = 36000

export class Token {
  static sign(_payload: Record<string, any>, secret?: string|null, options?: SignOptions) {
    const payload = Object.assign({}, _payload)
    delete payload.iat
    delete payload.exp

    const signed = asyncSign(payload, secret || APPLICATION_SECRET, options || {
      expiresIn: EXPIRES_IN
    }) as unknown

    return signed as Promise<string>
  }

  static verify(token: string, secret?: string) {
    return asyncVerify(token, secret || APPLICATION_SECRET)
  }

  static decode(token: string, secret?: string) {
    return asyncVerify(token, secret || APPLICATION_SECRET)
  }
}
