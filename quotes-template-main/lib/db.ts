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
  // Configuración optimizada del pool de conexiones
  maxPoolSize: 10, // Máximo 10 conexiones en el pool
  minPoolSize: 1,  // Mínimo 1 conexión siempre disponible
  maxIdleTimeMS: 30000, // Cerrar conexiones inactivas después de 30 segundos
  connectTimeoutMS: 10000, // Timeout de conexión de 10 segundos
  socketTimeoutMS: 45000, // Timeout de socket de 45 segundos
}

// Variable global para reutilizar la conexión en producción también
let globalClient: MongoClient | null = null

export async function getMongoClient() {
  // Reutilizar la conexión global si existe
  if (globalClient) {
    try {
      // Verificar si la conexión sigue activa
      await globalClient.db().admin().ping()
      return globalClient
    } catch (error) {
      // Si la conexión se perdió, crear una nueva
      console.log('MongoDB connection lost, creating new connection...')
      globalClient = null
    }
  }

  // Crear nueva conexión
  globalClient = new MongoClient(uri, options)

  try {
    await globalClient.connect()
    const db = globalClient.db();

    // Crea el índice TTL para comentarios (si no existe)
    await db.collection('comments').createIndex(
      { date: 1 },
      { expireAfterSeconds: 157680000 }
    );

    console.log('MongoDB connected successfully')
    return globalClient
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error)
    globalClient = null
    throw error
  }
}

// Función para cerrar la conexión (útil para tests o shutdown)
export async function closeMongoConnection() {
  if (globalClient) {
    await globalClient.close()
    globalClient = null
    console.log('MongoDB connection closed')
  }
}