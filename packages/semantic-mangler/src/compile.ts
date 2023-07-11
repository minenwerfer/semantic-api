import ts from 'typescript'
import path from 'path'
import { readFile } from 'fs/promises'
import * as R from 'ramda'
import { log } from './log'

export const compile = async (fileList: Array<string>) => {
  const tsConfig = JSON.parse((await readFile(`${process.cwd()}/tsconfig.json`)).toString()) as {
    extends?: string
  } & typeof import('./config/tsconfig.json')

  if( tsConfig.extends ) {
    const resolvedPath = require.resolve(path.join(process.cwd(), tsConfig.extends))

    Object.assign(tsConfig, R.mergeDeepWith(
      (l, r) => R.is(Object, l) && R.is(Object, r)
        ? R.concat(l, r)
        : r,
      tsConfig,
      JSON.parse((await readFile(resolvedPath)).toString())
    ))
  }

  const compilerOptions = tsConfig.compilerOptions as unknown

  const program = ts.createProgram(fileList, compilerOptions as ts.CompilerOptions)
  const emitResult = program.emit()

  const allDiagnostics = ts
    .getPreEmitDiagnostics(program)
    .concat(emitResult.diagnostics)

  if( allDiagnostics.length ) {
    allDiagnostics.forEach((diagnostic) => {
      if( diagnostic.file ) {
        const { line, character } = ts.getLineAndCharacterOfPosition(
          diagnostic.file,
          diagnostic.start!
        )

        const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')
        log('error', `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`)
        return
      }

      log('error', ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'))
    })

    log('error', `${allDiagnostics.length} errors found`)
  }


  if( emitResult.emitSkipped ) {
    return {
      success: false,
      diagnostics: allDiagnostics
    }
  }

  return {
    success: true,
    program
  }
}
