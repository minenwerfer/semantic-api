import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
export * from 'axios'

/**
 * @exports
 * @class
 *
 * A wrapper for sending HTTP requests.
 */
export class RequestProvider {
  private _instance: AxiosInstance
  private _proxiedInstance: AxiosInstance
  private _defaultConfig: object = {
    //
  }

  private _authToken: string|null = null
  private _maxRetries = 3
  private _retries = 0

  /**
   * @constructor
   * @param {AxiosRequestConfig} config - pass this config to axios along with the default one
   */
  constructor(readonly config?: AxiosRequestConfig) {
    this._instance = axios.create({
      ...this._defaultConfig,
      ...config,
    })

    this._instance.interceptors.request.use((config: any) => {
      const newConfig = { ...config }

      if( this.token ) {
        Object.assign(newConfig, {
          headers: {
            authorization: `Bearer ${this.token}`
          }
        })
      }

      return newConfig
    })

    /**
     * Chains throwOnError static method on axios calls.
     */
    this._proxiedInstance = new Proxy(this._instance, {
      get: (target: any, key: string) => {
        const method = target[key]

        if( ![
            'request',
            'post',
            'get'
        ].includes(key) )  {
           return typeof method === 'function'
             ? (...args: any) => method.apply(target, args)
             : method
        }

        const func = (...args: any) => {
          return method.apply(target, args)
            .then((res: AxiosResponse) => {
              try {
                RequestProvider.throwOnError(res)
              } catch( err ) {
                if( this._retries < this._maxRetries && res.status !== 200 ) {
                  this._retries++
                  return func(...args)
                }

                throw err
              }

              return res
            })
        }

        return func
      }

    })
  }

  get token(): string|null {
    return 'sessionStorage' in global
      ? sessionStorage.getItem('auth:token')
      : this._authToken
  }

  set token(value: string|null) {
    this._authToken = value
  }

  get instance(): AxiosInstance {
    return this._proxiedInstance
  }

  /**
   * @static @method
   * Throws an error if request status is 200<=x<304 but "error" property is present.
   */
  static throwOnError({ data }: AxiosResponse) {
    if( data.error ) {
      const error = new Error(data.error.message)
      Object.assign(error, data.error)
      throw error
    }
  }

  public request(config: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.instance.request(config)
  }

  public get(uri: string): Promise<AxiosResponse> {
    return this.instance.get(uri)
  }

  public post(uri: string, data: any, options = {}): Promise<AxiosResponse> {
    return this.instance.post(uri, data, options)
  }
}
