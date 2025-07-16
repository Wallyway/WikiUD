import { MongoClient, ServerApiVersion, ReadPreference } from 'mongodb'
import "server-only"

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

const uri = process.env.MONGODB_URI
const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  // Optimizar el pool de conexiones para free tier
  maxPoolSize: 5, // Reducido de 10 a 5 para free tier
  minPoolSize: 0,  // No mantener conexiones inactivas
  maxIdleTimeMS: 15000, // Cerrar conexiones inactivas más rápido (15 segundos)
  connectTimeoutMS: 5000, // Timeout de conexión más rápido (5 segundos)
  socketTimeoutMS: 30000, // Timeout de socket más rápido (30 segundos)
  // Agregar más optimizaciones
  retryWrites: true,
  retryReads: true,
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

// Patrón singleton para reutilizar la conexión
if (process.env.NODE_ENV === "development") {
  // En desarrollo, usar variable global para evitar múltiples conexiones durante hot reload
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // En producción, también usar singleton pero sin variable global
  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(uri, options)
      ; (global as any)._mongoClientPromise = client.connect()
  }
  clientPromise = (global as any)._mongoClientPromise
}

export async function getMongoClient() {
  try {
    const client = await clientPromise
    const db = client.db();

    // Crear índices solo si no existen (evitar operaciones repetitivas)
    const collections = await db.listCollections().toArray()
    const commentsCollectionExists = collections.some(col => col.name === 'comments')
    const teachersCollectionExists = collections.some(col => col.name === 'teachers')

    // Crear índices en paralelo para optimizar
    const indexPromises = []

    if (commentsCollectionExists) {
      indexPromises.push(
        db.collection('comments').createIndex(
          { date: 1 },
          { expireAfterSeconds: 157680000 }
        ).catch(err => console.warn('Comments TTL index error:', err))
      )

      // Índice para búsqueda por teacherId
      indexPromises.push(
        db.collection('comments').createIndex(
          { teacherId: 1, date: -1 }
        ).catch(err => console.warn('Comments teacherId index error:', err))
      )
    }

    if (teachersCollectionExists) {
      // Índice para búsqueda por nombre
      indexPromises.push(
        db.collection('teachers').createIndex(
          { name: 1 }
        ).catch(err => console.warn('Teachers name index error:', err))
      )

      // Índice para búsqueda por facultad
      indexPromises.push(
        db.collection('teachers').createIndex(
          { faculty: 1 }
        ).catch(err => console.warn('Teachers faculty index error:', err))
      )

      // Índice compuesto para búsquedas combinadas
      indexPromises.push(
        db.collection('teachers').createIndex(
          { name: 1, faculty: 1 }
        ).catch(err => console.warn('Teachers compound index error:', err))
      )
    }

    // Ejecutar todos los índices en paralelo
    await Promise.all(indexPromises)

    return client
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
    throw error
  }
}