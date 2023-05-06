import type { Config, Collections } from '../types/config'

export const defineConfig = <_Collections extends Collections>(config: Config<_Collections>) => <const>config
