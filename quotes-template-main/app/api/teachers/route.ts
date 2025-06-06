import { NextResponse } from 'next/server'
import { getMongoClient } from '@/lib/db'

// Function to remove accents from text
function removeAccents(str: string) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const name = searchParams.get('name') || ''
        const faculty = searchParams.get('faculty') || ''
        const page = parseInt(searchParams.get('page') || '1', 10)
        const limit = parseInt(searchParams.get('limit') || '9', 10)
        const skip = (page - 1) * limit

        console.log('Search terms:', { name, faculty })

        const client = await getMongoClient()
        const db = client.db()

        // Get all teachers and filter in memory for better accent handling
        const allTeachers = await db.collection("teachers").find({}).toArray()

        // Filter teachers based on name and/or faculty (case-insensitive and accent-insensitive)
        const filteredTeachers = allTeachers.filter(teacher => {
            const teacherNameNoAccents = removeAccents(teacher.name.toLowerCase())
            const teacherFacultyNoAccents = removeAccents(teacher.faculty.toLowerCase())
            const searchNameNoAccents = removeAccents(name.toLowerCase())
            const searchFacultyNoAccents = removeAccents(faculty.toLowerCase())

            // If both name and faculty are empty, return all teachers
            if (!name.trim() && !faculty.trim()) {
                return true
            }

            // If only name is provided, check name
            if (name.trim() && !faculty.trim()) {
                return teacherNameNoAccents.includes(searchNameNoAccents)
            }

            // If only faculty is provided, check faculty
            if (!name.trim() && faculty.trim()) {
                return teacherFacultyNoAccents.includes(searchFacultyNoAccents)
            }

            // If both are provided, check both
            return teacherNameNoAccents.includes(searchNameNoAccents) &&
                teacherFacultyNoAccents.includes(searchFacultyNoAccents)
        })

        // Paginate
        const paginatedTeachers = filteredTeachers.slice(skip, skip + limit)

        console.log('Found teachers:', paginatedTeachers.length)

        return NextResponse.json({ teachers: paginatedTeachers })
    } catch (error) {
        console.error('Error fetching teachers:', error)
        return NextResponse.json(
            { error: 'Failed to fetch teachers' },
            { status: 500 }
        )
    }
} 