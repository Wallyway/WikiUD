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
  // Configuración optimizada del pool de conexiones
  maxPoolSize: 1, // Máximo 10 conexiones en el pool
  minPoolSize: 0,  // Mínimo 1 conexión siempre disponible
  maxIdleTimeMS: 5000, // Cerrar conexiones inactivas después de 10 segundos
  connectTimeoutMS: 10000, // Timeout de conexión de 10 segundos
  socketTimeoutMS: 45000, // Timeout de socket de 45 segundos
  // Configuraciones adicionales para optimizar
  retryWrites: true, // Reintentar escrituras fallidas
  retryReads: true,  // Reintentar lecturas fallidas
  readPreference: ReadPreference.PRIMARY_PREFERRED, // Leer desde primario preferentemente
  // Configuraciones de heartbeat
  heartbeatFrequencyMS: 10000, // Frecuencia de heartbeat cada 10s
  serverSelectionTimeoutMS: 5000, // Timeout de selección de servidor
}

// Variable global para reutilizar la conexión en producción también
let globalClient: MongoClient | null = null
let connectionStats = {
  totalConnections: 0,
  activeConnections: 0,
  lastConnectionTime: null as Date | null,
  errors: 0
}

export async function getMongoClient() {
  // Reutilizar la conexión global si existe
  if (globalClient) {
    try {
      // Verificar si la conexión sigue activa
      await globalClient.db().admin().ping()
      connectionStats.activeConnections++
      return globalClient
    } catch (error) {
      // Si la conexión se perdió, crear una nueva
      console.log('MongoDB connection lost, creating new connection...')
      connectionStats.errors++
      globalClient = null
    }
  }

  // Crear nueva conexión
  globalClient = new MongoClient(uri, options)
  connectionStats.totalConnections++
  connectionStats.lastConnectionTime = new Date()

  try {
    await globalClient.connect()
    const db = globalClient.db();

    // Crea el índice TTL para comentarios (si no existe)
    await db.collection('comments').createIndex(
      { date: 1 },
      { expireAfterSeconds: 157680000 }
    );

    // Crear índices adicionales para optimizar consultas
    await db.collection('teachers').createIndex(
      { name: 1, faculty: 1 },
      { background: true }
    );

    await db.collection('comments').createIndex(
      { teacherId: 1, date: -1 },
      { background: true }
    );

    console.log('MongoDB connected successfully')
    return globalClient
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error)
    connectionStats.errors++
    globalClient = null
    throw error
  }
}

// Función para cerrar la conexión (útil para tests o shutdown)
export async function closeMongoConnection() {
  if (globalClient) {
    await globalClient.close()
    globalClient = null
    connectionStats.activeConnections = 0
    console.log('MongoDB connection closed')
  }
}

// Función para obtener estadísticas de conexión (útil para monitoreo)
export function getConnectionStats() {
  return {
    ...connectionStats,
    isConnected: globalClient !== null,
    lastConnectionTime: connectionStats.lastConnectionTime?.toISOString()
  }
}

// Función para limpiar estadísticas (útil para tests)
export function resetConnectionStats() {
  connectionStats = {
    totalConnections: 0,
    activeConnections: 0,
    lastConnectionTime: null,
    errors: 0
  }
}