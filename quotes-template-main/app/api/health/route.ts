import { NextResponse } from 'next/server'
import { getMongoClient } from '@/lib/db'

export async function GET() {
    try {
        const client = await getMongoClient()
        const db = client.db()

        // Obtener estadísticas del servidor
        const serverStats = await db.admin().serverStatus()

        const currentConnections = serverStats.connections?.current || 0
        const availableConnections = serverStats.connections?.available || 0
        const activeConnections = serverStats.connections?.active || 0

        // Calcular porcentaje de uso
        const totalConnections = currentConnections + availableConnections
        const usagePercentage = totalConnections > 0 ? (currentConnections / totalConnections) * 100 : 0

        // Determinar estado de salud
        let status = 'healthy'
        let warning = null

        if (usagePercentage > 80) {
            status = 'warning'
            warning = 'High connection usage detected'
        } else if (usagePercentage > 90) {
            status = 'critical'
            warning = 'Critical connection usage - consider upgrading MongoDB cluster'
        }

        return NextResponse.json({
            status,
            warning,
            mongodb: {
                connections: {
                    current: currentConnections,
                    available: availableConnections,
                    active: activeConnections,
                    usagePercentage: Math.round(usagePercentage * 100) / 100
                },
                uptime: serverStats.uptime,
                version: serverStats.version,
            },
            recommendations: usagePercentage > 80 ? [
                'Consider upgrading to M10 cluster (1,000 connections)',
                'Check for connection leaks in your application',
                'Review rate limiting settings'
            ] : [],
            timestamp: new Date().toISOString()
        })
    } catch (error) {
        return NextResponse.json(
            {
                status: 'unhealthy',
                error: error instanceof Error ? error.message : 'Unknown error',
                timestamp: new Date().toISOString()
            },
            { status: 500 }
        )
    }
} 