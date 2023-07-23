import mongoose from 'mongoose'
export { mongoose }

export const options = {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
}

type Connections = {
  default: Awaited<ReturnType<typeof mongoose.connect>>
}

declare global {
  var semanticapi__Connections: Connections
}

const isDevelopment = process.env.NODE_ENV === 'development'

mongoose.set('strictQuery', true)
mongoose.set('bufferCommands', false)
mongoose.set('debug', isDevelopment)

export const connectDatabase = async () => {
  const mongodbUri = await (async () => {
    const envUri = process.env.MONGODB_URI
    if( !envUri ) {
      console.warn(
        `mongo URI wasn't supplied, fallbacking to memory storage (this means your data will only be alive during runtime)`
      )

      const { MongoMemoryServer } = require('mongodb-memory-server')
      const mongod = await MongoMemoryServer.create()
      return mongod.getUri()
    }

    return envUri
  })()

  global.semanticapi__Connections ??= {
    default: {}
  } as Connections

  const connection = global.semanticapi__Connections.default = await mongoose.connect(mongodbUri)
  return connection
}
