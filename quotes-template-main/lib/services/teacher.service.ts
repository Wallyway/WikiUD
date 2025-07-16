import { getMongoClient } from '../db'
import { buildAccentInsensitiveRegex } from '../string-utils'
import { Teacher, TeacherService, TeacherSearchParams } from '@/types/teacher'

export class TeacherServiceImpl implements TeacherService {
    private async getDb() {
        const client = await getMongoClient()
        return client.db()
    }

    async searchTeachers({ name = '', faculty = '', page = 1, limit = 9 }: TeacherSearchParams): Promise<Teacher[]> {
        const client = await getMongoClient();
        const db = client.db();
        const collection = db.collection('teachers');

        const query: any = {};

        if (name.trim()) {
            // Permitir búsqueda por palabras en cualquier orden
            const words = name.trim().split(/\s+/);
            query.$and = words.map((word: string) => ({
                name: { $regex: buildAccentInsensitiveRegex(word), $options: 'i' }
            }));
        }

        if (faculty.trim()) {
            query.faculty = { $regex: buildAccentInsensitiveRegex(faculty), $options: 'i' };
        }

        const skip = (page - 1) * limit;

        try {
            // Optimizar: solo obtener los campos necesarios
            const teachers = await collection
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
                .sort({ name: 1 }) // Ordenar por nombre para consistencia
                .skip(skip)
                .limit(limit)
                .maxTimeMS(5000) // Timeout de 5 segundos
                .toArray();

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
            }));
        } catch (error) {
            console.error('Error in searchTeachers:', error);
            throw new Error('Failed to search teachers');
        }
    }
} 