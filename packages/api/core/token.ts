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

/**
 * @exports @const
 * Random alphanumeric sequence for salting JWT.
 */
export const { APPLICATION_SECRET } = process.env

/**
 * @exports @const
 * Expiration time in seconds.
 */
export const EXPIRES_IN = 36000

export class TokenService {
  static sign(payload: object, secret?: string): Promise<void|string> {
    if( !APPLICATION_SECRET ) {
      throw new Error('APPLICATION_SECRET is undefined')
    }

    return asyncSign(payload, secret || APPLICATION_SECRET, {
      expiresIn: EXPIRES_IN
    })
  }

  static verify(token: string, secret?: string) {
    return asyncVerify(token, secret || APPLICATION_SECRET)
  }

  static decode(token: string, secret?: string): Promise<any> {
    return asyncVerify(token, secret || APPLICATION_SECRET)
  }
}
