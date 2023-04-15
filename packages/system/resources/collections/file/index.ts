import description from './file.description'
import model from './file.model'

import _delete from './functions/delete'
import download from './functions/download'
import insert from './functions/insert'

export default {
  description,
  model,
  functions: {
    delete: _delete,
    download,
    insert
  }
}
