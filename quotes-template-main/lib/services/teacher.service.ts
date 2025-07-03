import { getMongoClient } from '../db'
import { buildAccentInsensitiveRegex } from '../string-utils'
import { Teacher, TeacherService, TeacherSearchParams } from '@/types/teacher'

export class TeacherServiceImpl implements TeacherService {
    private async getDb() {
        const client = await getMongoClient()
        return client.db()
    }

    async searchTeachers(params: TeacherSearchParams): Promise<Teacher[]> {
        const { name = '', faculty = '', page = 1, limit = 9 } = params
        const skip = (page - 1) * limit

        const db = await this.getDb()
        const query: any = {}

        if (name.trim()) {
            query.name = { $regex: buildAccentInsensitiveRegex(name), $options: 'i' }
        }

        if (faculty.trim()) {
            query.faculty = { $regex: buildAccentInsensitiveRegex(faculty), $options: 'i' }
        }

        const teachers = await db.collection("teachers")
            .find(query)
            .skip(skip)
            .limit(limit)
            .toArray()

        // Transform MongoDB documents to Teacher objects
        return teachers.map(teacher => ({
            _id: teacher._id.toString(),
            name: teacher.name,
            faculty: teacher.faculty,
            degree: teacher.degree,
            subject: teacher.subject,
            email: teacher.email,
            rating: teacher.rating,
            reviews: teacher.reviews
        }))
    }
} 