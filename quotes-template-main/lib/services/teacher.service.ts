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
        const db = await this.getDb()
        const query: any = {}

        // Optimización: usar índices de texto para búsquedas más eficientes
        if (name.trim()) {
            // Permitir búsqueda por palabras en cualquier orden
            const words = name.trim().split(/\s+/);
            query.$and = words.map((word: string) => ({
                name: { $regex: buildAccentInsensitiveRegex(word), $options: 'i' }
            }));
        }

        if (faculty.trim()) {
            query.faculty = { $regex: buildAccentInsensitiveRegex(faculty), $options: 'i' }
        }

        const skip = (page - 1) * limit

        // Optimización: usar projection para solo traer campos necesarios
        const teachers = await db.collection("teachers")
            .find(query)
            .project({
                _id: 1,
                name: 1,
                faculty: 1,
                degree: 1,
                subject: 1,
                email: 1,
                rating: 1,
                reviews: 1
            })
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