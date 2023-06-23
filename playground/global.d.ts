import type { collections } from '.'
import type { AssetType, ResourceErrors } from '@semantic-api/api'
import { Either, Left } from '@semantic-api/common'
import * as SystemCollections from '@semantic-api/system/collections'

declare module '@semantic-api/api' {
  type UserCollections = typeof collections
  type Collections = {
    [K in keyof (UserCollections & typeof SystemCollections)]: Awaited<ReturnType<(UserCollections & typeof SystemCollections)[K]>>
  }

  type UserAccessControl = typeof accessControl

  type UserACProfile = {
    roles: ReadonlyArray<keyof UserAccessControl['roles']>
  }
  
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
