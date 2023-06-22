import description from './description'
import insert from './insert'
import download from './download'
import _delete from './delete'

export default () => ({
  description,
  functions: {
    insert,
    download,
    delete: _delete
  }
})
