import { createHash } from 'crypto'
import { writeFile, unlink } from 'fs/promises'
import { type Context, useFunctions } from '@semantic-api/api'
import { description, type File } from './description'

type Props = {
  what: { content: string } & Pick<File,
    '_id'
    | 'filename'
    | 'owner'
    | 'absolute_path'
  >
}

const insert = async (props: Props, context: Context<typeof description>) => {
  const { insert } = useFunctions<File>()()
  const what = Object.assign({}, props.what)
  what.owner = context.token?.user._id
  const { STORAGE_PATH } = process.env

  const extension = what.filename?.split('.').pop()
  if( !extension ) {
    throw new Error('filename lacks extension')
  }

  const oldFile = await context.collection.functions.get({
    filters: {
      _id: props.what._id 
    },
    project: [
      'absolute_path'
    ]
  }, context)

  if( oldFile ) {
    await unlink(oldFile.absolute_path!).catch(console.trace)
  }

  const filenameHash = createHash('sha1')
    .update(what.filename + Date.now())
    .digest('hex')

  what.absolute_path = `${STORAGE_PATH}/${filenameHash}.${extension}`
  await writeFile(what.absolute_path, Buffer.from(what.content.split(',').pop()!, 'base64'))

  return insert({
    ...props,
    what
  }, context)
}

export default insert
