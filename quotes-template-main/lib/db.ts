import { MongoClient, ServerApiVersion } from 'mongodb'
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
  // Configuración del pool de conexiones
  maxPoolSize: 5, // Reducido de 10 a 5 para evitar saturar M0
  minPoolSize: 1,  // Mínimo 1 conexión siempre disponible
  maxIdleTimeMS: 15000, // Reducido a 15 segundos para liberar conexiones más rápido
  connectTimeoutMS: 5000, // Reducido a 5 segundos
  socketTimeoutMS: 30000, // Reducido a 30 segundos
  serverSelectionTimeoutMS: 5000, // Timeout de selección de servidor
}

let client: MongoClient

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClient?: MongoClient
  }

  if (!globalWithMongo._mongoClient) {
    globalWithMongo._mongoClient = new MongoClient(uri, options)
  }
  client = globalWithMongo._mongoClient
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options)
}

export async function getMongoClient() {
  try {
    await client.connect()
    const db = client.db();

    // Log de conexiones activas (solo en desarrollo)
    if (process.env.NODE_ENV === 'development') {
      const serverStats = await db.admin().serverStatus()
      console.log(`MongoDB connections - Current: ${serverStats.connections?.current}, Available: ${serverStats.connections?.available}`)
    }

    // Crea el índice TTL para comentarios (si no existe)
    await db.collection('comments').createIndex(
      { date: 1 },
      { expireAfterSeconds: 157680000 }
    );

    // Índices optimizados para búsquedas de profesores
    await db.collection('teachers').createIndex(
      { name: "text", faculty: 1 },
      { background: true }
    );

    // Índice compuesto para búsquedas por facultad
    await db.collection('teachers').createIndex(
      { faculty: 1, name: 1 },
      { background: true }
    );
  } catch (e) {
    // Already connected
  }
  return client
}