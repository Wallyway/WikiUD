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
        const page = parseInt(searchParams.get('page') || '1', 10)
        const limit = parseInt(searchParams.get('limit') || '9', 10)
        const skip = (page - 1) * limit

        console.log('Search term:', name)

        const client = await getMongoClient()
        const db = client.db()

        // Get all teachers and filter in memory for better accent handling
        const allTeachers = await db.collection("teachers").find({}).toArray()

        // Filter teachers based on name (case-insensitive and accent-insensitive)
        const filteredTeachers = name.trim()
            ? allTeachers.filter(teacher => {
                const teacherNameNoAccents = removeAccents(teacher.name.toLowerCase())
                const searchNameNoAccents = removeAccents(name.toLowerCase())
                return teacherNameNoAccents.includes(searchNameNoAccents)
            })
            : allTeachers

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