import { NextResponse } from 'next/server'
import { TeacherServiceImpl } from '@/lib/services/teacher.service'
import redis from '@/lib/redis'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const name = searchParams.get('name') || ''
        const faculty = searchParams.get('faculty') || ''
        const page = parseInt(searchParams.get('page') || '1', 10)
        const limit = parseInt(searchParams.get('limit') || '9', 10)

        // Clave única para el caché
        const cacheKey = `teachers:${name}:${faculty}:${page}:${limit}`;
        const cached = await redis.get(cacheKey);
        if (cached) {
            return NextResponse.json(JSON.parse(cached));
        }

        const teacherService = new TeacherServiceImpl()
        const teachers = await teacherService.searchTeachers({ name, faculty, page, limit })

        // Responde al usuario inmediatamente
        const response = { teachers };
        redis.set(cacheKey, JSON.stringify(response), "EX", 60);

        return NextResponse.json(response)
    } catch (error) {
        console.error('Error fetching teachers:', error)
        return NextResponse.json(
            { error: 'Failed to fetch teachers' },
            { status: 500 }
        )
    }
} 