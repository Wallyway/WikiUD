import { NextResponse } from 'next/server'
import { TeacherServiceImpl } from '@/lib/services/teacher.service'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const name = searchParams.get('name') || ''
        const faculty = searchParams.get('faculty') || ''
        const page = parseInt(searchParams.get('page') || '1', 10)
        const limit = parseInt(searchParams.get('limit') || '9', 10)

        console.log('Search terms:', { name, faculty })

        const teacherService = new TeacherServiceImpl()
        const teachers = await teacherService.searchTeachers({ name, faculty, page, limit })

        console.log('Found teachers (DB query):', teachers.length)

        return NextResponse.json({ teachers: teachers })
    } catch (error) {
        console.error('Error fetching teachers:', error)
        return NextResponse.json(
            { error: 'Failed to fetch teachers' },
            { status: 500 }
        )
    }
} 