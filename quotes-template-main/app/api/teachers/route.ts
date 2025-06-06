import { NextResponse } from 'next/server'
import { getMongoClient } from '@/lib/db'

// Function to remove accents from text
function removeAccents(str: string) {
    return str.normalize('NFD').replace(/[̀-ͯ]/g, '');
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

        // Construct the query object based on search parameters
        const query: any = {}

        if (name.trim()) {
            // Apply removeAccents to the search term and use regex for case-insensitive matching
            query.name = { $regex: removeAccents(name), $options: 'i' }
        }

        if (faculty.trim()) {
            // Apply removeAccents to the search term and use regex for case-insensitive matching
            query.faculty = { $regex: removeAccents(faculty), $options: 'i' }
        }

        // If both name and faculty are provided, MongoDB's find with multiple fields acts as AND
        // If only one is provided, the query object will contain only that field's condition
        // If neither is provided, the query object is empty {}, fetching all documents

        // Fetch and paginate teachers directly from the database
        const teachers = await db.collection("teachers")
            .find(query)
            .skip(skip)
            .limit(limit)
            .toArray()

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