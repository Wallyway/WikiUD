import { NextResponse } from 'next/server'
import { getConnectionStats } from '@/lib/db'
import redis from '@/lib/redis'

export async function GET() {
    try {
        const mongoStats = getConnectionStats()

        // Verificar conexión a Redis
        let redisStatus = 'unknown'
        try {
            await redis.ping()
            redisStatus = 'connected'
        } catch (error) {
            redisStatus = 'error'
        }

        const healthData = {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            services: {
                mongodb: {
                    status: mongoStats.isConnected ? 'connected' : 'disconnected',
                    stats: mongoStats
                },
                redis: {
                    status: redisStatus
                }
            },
            uptime: process.uptime(),
            memory: process.memoryUsage()
        }

        return NextResponse.json(healthData)
    } catch (error) {
        console.error('Health check error:', error)
        return NextResponse.json(
            {
                status: 'unhealthy',
                error: 'Health check failed',
                timestamp: new Date().toISOString()
            },
            { status: 500 }
        )
    }
} 