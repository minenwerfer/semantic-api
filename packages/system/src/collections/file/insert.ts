import { createHash } from 'crypto'
import { writeFile, unlink } from 'fs/promises'
import type { Context } from '@semantic-api/api'
import description, { File } from './description'

const { STORAGE_PATH } = process.env

type Props = {
  what: { content: string } & Pick<File,
    '_id'
    | 'filename'
    | 'owner'
    | 'absolute_path'
  >
}

const insert = async (props: Props, { token, collection }: Context<typeof description, any, any>) => {
  const what = Object.assign({}, props.what)
  what.owner = token?.user._id

  const extension = what.filename?.split('.').pop()
  if( !extension ) {
    throw new Error('filename lacks extension')
  }

  const oldFile = await collection.get({
    filters: {
      _id: props.what._id 
    }
  })

  if( oldFile ) {
    // if( oldFile.immutable === true ) {
    //   throw new Error('você não pode mais editar esse arquivo')
    // }
    await unlink(oldFile.absolute_path!).catch(console.trace)
  }

  const filenameHash = createHash('sha1')
    .update(what.filename + Date.now())
    .digest('hex')

  what.absolute_path = `${STORAGE_PATH}/${filenameHash}.${extension}`
  await writeFile(what.absolute_path, Buffer.from(what.content.split(',').pop()!, 'base64'))

  return collection.insert({
    ...props,
    what
  })
}

export default insert
