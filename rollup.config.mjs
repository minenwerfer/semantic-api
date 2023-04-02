import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import nodeResolve from '@rollup/plugin-node-resolve'
// import typescript from '@rollup/plugin-typescript'

// import tsConfig from './tsconfig.json' assert { type: 'json' }
// import tsConfigEsm from './tsconfig.esm.json' assert { type: 'json' }
//
const packages = [
  // 'api',
  'system',
  // 'common',
  // 'types'
]

const config = Object.fromEntries(packages.map((packageName) => [
  packageName, {
    input: `dist/${packageName}/esm/index.js`,
    plugins: [
      // typescript(tsConfigEsm),
      commonjs(),
      json(),
      nodeResolve({
        preferBuiltins: true
      })
    ],
    output: [
      {
        file: `dist/${packageName}.cjs`,
        format: 'commonjs',
        exports: 'named',
        sourcemap: true
      },
      {
        file: `dist/${packageName}.mjs`,
        format: 'esm',
        sourcemap: true
      }
    ]
  }
]))

config.system.plugins = [
  commonjs({
    include: /resources/,
    dynamicRequireTargets: [
      'dist/system/esm/**/*.js'
    ]
  }),
  nodeResolve()
]

export default Object.values(config)
