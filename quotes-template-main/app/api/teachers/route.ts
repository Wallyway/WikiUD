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

        console.log('Search terms:', { name, faculty })

        const teacherService = new TeacherServiceImpl()
        const teachers = await teacherService.searchTeachers({ name, faculty, page, limit })

        console.log('Found teachers (DB query):', teachers.length)

        // Guarda en caché por 60 segundos
        await redis.set(cacheKey, JSON.stringify({ teachers }), "EX", 60);

        return NextResponse.json({ teachers: teachers })
    } catch (error) {
        console.error('Error fetching teachers:', error)
        return NextResponse.json(
            { error: 'Failed to fetch teachers' },
            { status: 500 }
        )
    }
} 