import glob from 'glob'
import { rollup, InputOptions, OutputOptions } from 'rollup'
import terser from '@rollup/plugin-terser'
import json from '@rollup/plugin-json'
import { getLicense } from './licensing'

const root = process.cwd()

const inputOptions: InputOptions = {
  plugins: [
    json(),
    terser({
      output: {
        comments: true
      }
    })
  ],
  external: [
    /node_modules/
  ],
  onwarn: () => null
}


const outputOptions: OutputOptions = {
  format: 'cjs',
  sourcemap: false,
}

const makeInputs = async () => {
  const files = glob.sync(`${root}/dist/**/*.js`)
  return files.map((file) => ({
    ...inputOptions,
    input: file,
  }))
}

export const build = async () => {
  const inputs = await makeInputs()

  const license = await getLicense('MIT')
  outputOptions.banner = `/* @license MIT\n${license}*/`

  for( const input of inputs ) {
    const path = input.input.replace('/dist/', '/release/')
    const output = {
      ...outputOptions,
      file: path
    }

    const bundle = await rollup(input)
    await bundle.write(output)

    bundle?.close()
  }
}
