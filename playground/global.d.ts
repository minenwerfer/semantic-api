import type { config } from '.'

declare module '@semantic-api/api' {
  type TesteConfig = typeof config
  export async function get<
    const AssetName extends keyof TesteConfig['collections'],
    const AssetType extends keyof TesteConfig['collections'][AssetName]
  >(
    assetName: AssetName,
    assetType: AssetType,
    resourceType: ResourceType = 'collection',
    // test?: TesteConfig['collections'][AssetName][AssetType]
  ): Promise<AssetName extends keyof TesteConfig['collections']
    ? AssetType extends keyof TesteConfig['collections'][AssetName]
      ? TesteConfig['collections'][AssetName][AssetType]
      : never
      : never
    >
}

