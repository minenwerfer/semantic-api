import type { config, accessControl } from '.'
import { Either } from '@semantic-api/common'

declare module '@semantic-api/api' {
  type TesteConfig = typeof config
  type UserAccessControl = typeof accessControl

  type UserACProfile = {
    roles: ReadonlyArray<keyof UserAccessControl['roles']>
  }

  export async function get<
    const ResourceName extends keyof TesteConfig['collections'],
    const AssetName extends keyof TesteConfig['collections'][ResourceName]
  >(
    resourceName: ResourceName,
    assetName: AssetName,
  ): Promise<ResourceName extends keyof TesteConfig['collections']
    ? AssetName extends keyof TesteConfig['collections'][ResourceName]
      ? TesteConfig['collections'][ResourceName][AssetName]
      : never
      : never
  >

  export async function getFunction<
    const ResourceName extends keyof TesteConfig['collections'],
    const FunctionName extends keyof TesteConfig['collections'][ResourceName]['functions']
  >(
    resourceName: ResourceName,
    functionName: FunctionName,
    acProfile?: UserACProfile
  ): Promise<
    Either<
      string,
      ResourceName extends keyof TesteConfig['collections']
        ? FunctionName extends keyof TesteConfig['collections'][ResourceName]['functions']
          ? TesteConfig['collections'][ResourceName]['functions'][FunctionName]
          : never
          : never
    >
  >
}
