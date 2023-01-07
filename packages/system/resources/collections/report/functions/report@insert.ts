import type { ApiFunction } from '../../../../../api/types'
import { Report } from '../report.description'

// import ReportModel from '../report.model'
// import FileModel from '../../file/file.model'

type Props = {
  what: Partial<Report>
}

const insert: ApiFunction<Props> = async(_props, _token) => {
  // const {
  //   _collection: collectionName,
  //   type,
  //   format,

  // } = props.what||{}

  // if(
  //   !collectionName
  //   || !type
  //   || !format
  // ) {
  //   throw new Error(
  //     `Please fill in all required props`
  //   )
  // }
  
  // if( !(format in this._formatMap) ) {
  //   throw new Error('formato inválido')
  // }

  // if( !this.isGranted(token, 'report', collectionName) ) {
  //   throw new Error('forbidden method (hasnt report granted)')
  // }

  // props.what.filters = type !== 'everything'
  //   ? (props.what.filters || {})
  //   : {}

  // const Controller = getController(collectionName)
  // const instance = new Controller
  // instance.injected = this.injected

  // const description = instance.describe()

  // if( !description.report ) {
  //   throw new Error('você não pode gerar um relatório desse módulo')
  // }

  // const properties = this._getProperties(description)
  // const columns = this._getColumns(properties)

  // const propertiesNames = Object.keys(properties)

  // const result = await instance.getAll({
  //   filters: props.what.filters,
  //   offset: +(props.what.offset || 0)
  // })

  // const pipe = R.pipe(
  //   (r: any) => propertiesNames.reduce((a, b) => ({ ...a, [b]: r[b] ? r[b] : '' }), {}),
  //   (r: Report) => Object.entries(r)
  //     .reduce((a, [key, value]) => {
  //       if( !(key in properties) ) {
  //         return a
  //       }

  //       return {
  //         ...a,
  //         [key]: (() => {
  //           const val = Collection.formatValue(description, value, key, properties[key])
  //           return val.includes(',') && format === 'csv'
  //             ? `"${val}"`
  //             : val
  //         })()
  //       }
  //     }, {})
  // )
  // const rows = result
  //   .map(pipe)

  // const func = this._formatMap[format]
  // const { filename, mime } = await func.call(this, columns, rows)

  // props.what.entries_count = rows.length
  // props.what.file = await FileModel.create({
  //   owner: token.user._id,
  //   context: 'report',
  //   filename,
  //   mime,
  //   absolute_path: path.join(process.env.REPORTS_PATH!, filename),
  //   immutable: true
  // })

  // return super.insert.call(this, props)
}

export default insert
