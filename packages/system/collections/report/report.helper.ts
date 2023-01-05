import path from 'path'
import { fromEntries } from '../../../common/helpers'
import type { Description, CollectionProperty } from '../../../types'
const { writeFile } = require('fs').promises

const getFilename = (ext: string) => {
  if( !process.env.REPORTS_PATH ) {
    throw new Error('REPORTS_PATH not set')
  }

  return `report_${Date.now().toString()}.${ext}`
}

export const getProperties = (description: Description) => {
  const filter = (entries: any): any => {
    return fromEntries(entries.filter(([_, value]: [unknown, any]) => !value.noreport))
  }

  const table = description.reportProperties || description.table

  const entries = !table
    ? Object.entries(description.properties)
    : Object.entries(description.properties).filter(([key, _]) => table.includes(key))

  return filter(entries)
}

export const getColumns = (properties: Array<CollectionProperty>) => {
  return Object.values(properties).map(f => f.description!)
}

export const saveCSV = async (columns: Array<string>, rows: Array<any>) => {
  const filename = getFilename('csv')
  const buffer = rows.reduce((a: string, r: any) => (
    a.concat(Object.values(r).join(',') + '\n')

  ), columns.join(',') + '\n')

  await writeFile(path.join(process.env.REPORTS_PATH!, filename), buffer)
  return {
    filename,
    mime: 'text/csv'
  }
}

export const savePDF = () => {
  throw new Error('not implemented')
}
