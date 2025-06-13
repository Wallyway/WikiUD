export interface Teacher {
    _id: string;
    name: string;
    faculty: string;
    // Add other teacher properties as needed
}

export interface TeacherSearchParams {
    name?: string;
    faculty?: string;
    page?: number;
    limit?: number;
}

export interface TeacherService {
    /**
     * Searches for teachers based on the provided parameters
     * @param params Search parameters including name, faculty, pagination
     * @returns Promise resolving to an array of teachers matching the search criteria
     */
    searchTeachers(params: TeacherSearchParams): Promise<Teacher[]>;
} 