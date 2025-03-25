import { CourseInterface } from "../dtos/course.interface";
import { Endpoints } from "../config/endpoints";
import { toCamelCase } from "../../utils/case.converter";
import { CanvasHttpConnector } from "../../http/connections/canvas-http.connector";
import { HttpResponse } from "node-http-connector";

export class CoursesFactory {
    constructor(
        protected readonly connector: CanvasHttpConnector,
        protected version: string,
        protected accountId: string
    ) {}

    /**
     * Fetch courses from the API
     *
     * @param endpoint
     * @private
     */
    private async fetchCourses(endpoint: string): Promise<CourseInterface[]> {
        const response: HttpResponse<any> | undefined = await this.connector.get(endpoint);
        if (response) {
            const courses: any = toCamelCase(response.data);
            const coursePromises = courses.map(async (course: any) => ({
                ...course,
                id: '', // let the user generate their own local GUID
                courseNumber: course.id // Map API id to courseId
            }));
            return await Promise.all(coursePromises);
        }
        return [];
    }

    /**
     * List courses
     *
     * @param page
     * @param size
     */
    async listCourses(page: number, size: number): Promise<CourseInterface[]> {
        const endpoint: string = new Endpoints().LIST_COURSES
            .replace(':version', this.version)
            .replace(':account_id', this.accountId)
            .replace(':page', page.toString())
            .replace(':size', size.toString());

        return this.fetchCourses(endpoint);
    }

    /**
     * Get a course by ID
     *
     * @param courseId
     */
    async getCourse(courseId: string): Promise<CourseInterface | undefined> {
        const endpoint: string = new Endpoints().GET_COURSE
            .replace(':version', this.version)
            .replace(':course_id', courseId);

        const response: HttpResponse<any> | undefined = await this.connector.request('GET', endpoint);
        if (response) {
            const course: any = toCamelCase(response.data);
            return {
                ...course,
                id: '', // Let user generate local GUID
                courseNumber: course.id // Map API id to courseId
            };
        }
    }

    /**
     * List courses by enrollment term
     *
     * @param enrollmentTermId
     * @param page
     * @param size
     */
    async listCoursesByEnrollmentTerm(enrollmentTermId: number, page: number, size: number): Promise<CourseInterface[]> {
        const endpoint: string = new Endpoints().LIST_COURSES
            .replace(':version', this.version)
            .replace(':account_id', this.accountId)
            .replace('enrollment_term_id', enrollmentTermId.toString())
            .replace(':page', page.toString())
            .replace(':size', size.toString());

        return this.fetchCourses(endpoint);
    }
}