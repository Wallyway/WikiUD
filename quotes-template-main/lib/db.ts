import { MongoClient } from 'mongodb'
import "server-only"

declare global {
  // eslint-disable-next-line no-var, no-unused-vars
  var cachedClient: MongoClient | undefined
}

let client: MongoClient

if (process.env.NODE_ENV === 'production') {
  client = new MongoClient(process.env.MONGODB_URI!)
} else {
  if (!global.cachedClient) {
    global.cachedClient = new MongoClient(process.env.MONGODB_URI!)
  }
  client = global.cachedClient
}

export async function getMongoClient() {
  try {
    await client.connect()
  } catch (e) {
    // Already connected
  }
  return client
}