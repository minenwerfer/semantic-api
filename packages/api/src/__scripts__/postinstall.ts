import { writeFile } from 'fs/promises'
import path from 'path'

const DTS_FILENAME = 'semantic-api.d.ts'

const dts = `// this file will be overwritten
import type { AssetType, ResourceErrors, Context as Context_ } from '@semantic-api/api'
import type { Description } from '@semantic-api/types'
import { Either, Left } from '@semantic-api/common'

declare global {
  type UserCollections = typeof import('.').collections
  type SystemCollections = typeof import('@semantic-api/system/collections')

  type UserAlgorithms = typeof import('.').algorithms
  type SystemAlgorithms = typeof import('@semantic-api/system/algorithms')

  type Collections = {
    [K in keyof (UserCollections & SystemCollections)]: Awaited<ReturnType<(UserCollections & SystemCollections)[K]>>
  }

  type Algorithms = {
    [K in keyof (UserAlgorithms & SystemAlgorithms)]: Awaited<ReturnType<(UserAlgorithms & SystemAlgorithms)[K]>>
  }

  type Context<TDescription extends Description>
    = Context_<TDescription, Collections, Algorithms>

  type UserAccessControl = typeof accessControl

  type UserACProfile = {
    roles: ReadonlyArray<keyof UserAccessControl['roles']>
  }
}

declare module '@semantic-api/api' {
  export async function getResourceAsset<
    const ResourceName extends keyof Collections,
    const AssetName extends keyof Collections[ResourceName] & AssetType,
    ReturnedAsset=ResourceName extends keyof Collections
        ? AssetName extends keyof Collections[ResourceName]
          ? Collections[ResourceName][AssetName]
          : never
          : never
  >(
    resourceName: ResourceName,
    assetName: AssetName,
  ): Promise<
    Either<
      ResourceErrors,
      ReturnedAsset
    >
  >

  export const get = getResourceAsset
  
  export async function getFunction<
    ResourceName extends keyof Collections,
    FunctionName extends keyof Collections[ResourceName]['functions'],
    ReturnedFunction=ResourceName extends keyof Collections
        ? FunctionName extends keyof Collections[ResourceName]['functions']
          ? Collections[ResourceName]['functions'][FunctionName]
          : never
          : never
  >(
    resourceName: ResourceName,
    functionName: FunctionName,
    acProfile?: UserACProfile
  ): Promise<
    Either<
      ResourceErrors,
      ReturnedFunction
    >
  >
}
// `

const install = async () => {
  await writeFile(path.join('..', '..', '..', DTS_FILENAME), dts)
}

install()
