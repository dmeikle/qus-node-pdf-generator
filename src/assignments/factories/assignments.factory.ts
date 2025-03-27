import { CanvasHttpConnector } from "../../http/connections/canvas-http.connector";
import { AssignmentInterface } from "../dtos/assignment.interface";
import { Endpoints } from "../config/endpoints";
import { HttpResponse } from "node-http-connector";
import { toCamelCase } from "../../utils/case.converter";
import { DataInterface } from "../../rubrics/dtos/data.interface";
import { RubricInterface } from "../../rubrics/dtos/rubric.interface";
import { RatingInterface } from "../../rubrics/dtos/rating.interface";

export class AssignmentsFactory {
    constructor(
        protected readonly connector: CanvasHttpConnector,
        protected version: string,
        protected accountId: string
    ) {}

    /**
     * Fetch assignments
     *
     * @param endpoint
     * @private
     */
    private async fetchAssignments(endpoint: string): Promise<AssignmentInterface[]> {
        try {
            const response: HttpResponse<any> | undefined = await this.connector.get(endpoint);
            if (response) {
                const assignments: any = toCamelCase(response.data);
                const assignmentPromises = assignments.map(async (assignment: any): Promise<AssignmentInterface> => this.mapAssignment(assignment));
                return await Promise.all(assignmentPromises);
            }
        } catch (error) {
            console.error(`Error fetching assignments: ${error}`);
        }
        return [];
    }

    /**
     * Map assignment
     *
     * @param data
     */
    mapAssignment(data: any): AssignmentInterface {
        return {
            ...data,
            id: '', // let the user generate their own local GUID
            assignmentNumber: data.id, // Map API id to assignmentNumber
            createdAtRemote: data.createdAt,
            updatedAtRemote: data.updatedAt,
            rubric: data.rubric ? this.mapRubric(data.rubric) : null,
        };
    }

    /**
     * Map data
     *
     * @param data
     */
    mapData(data: any): DataInterface {
        return {
            ...data,
            ratings: data.ratings?.map((rating: any): RatingInterface => this.mapRating(rating)),
        };
    }

    /**
     * Map rubric
     *
     * @param data
     */
    mapRubric(data: RubricInterface): RubricInterface {
        return {
            ...data,
            data: data.data?.map((item: any): DataInterface => this.mapData(item)),
        };
    }

    /**
     * Map rating
     *
     * @param data
     */
    mapRating(data: any): RatingInterface {
        return {
            ...data,
        };
    }

    /**
     * List assignments by course
     *
     * @param courseId
     * @param page
     * @param size
     */
    async listAssignmentsByCourse(courseId: string, page: number, size: number): Promise<AssignmentInterface[]> {
        const endpoint: string = new Endpoints().LIST_ASSIGNMENTS
            .replace(':version', this.version)
            .replace(':course_id', courseId)
            .replace(':page', page.toString())
            .replace(':size', size.toString());

        return this.fetchAssignments(endpoint);
    }

    /**
     * List assignments by course with due dates
     *
     * @param courseId
     * @param page
     * @param size
     */
    async listAssignmentsByCourseWithDueDates(courseId: string, page: number, size: number): Promise<AssignmentInterface[]> {
        const endpoint: string = new Endpoints().LIST_ASSIGNMENTS_WITH_DUE_DATES
            .replace(':version', this.version)
            .replace(':course_id', courseId)
            .replace(':page', page.toString())
            .replace(':size', size.toString());

        return this.fetchAssignments(endpoint);
    }

    /**
     * List assignments by user and course
     *
     * @param courseId
     * @param userId
     * @param page
     * @param size
     */
    async listAssignmentsByUserAndCourse(courseId: string, userId: string, page: number, size: number): Promise<AssignmentInterface[]> {
        const endpoint: string = new Endpoints().LIST_ASSIGNMENTS_BY_USER_AND_COURSE
            .replace(':version', this.version)
            .replace(':user_id', userId)
            .replace(':course_id', courseId)
            .replace(':page', page.toString())
            .replace(':size', size.toString());

        return this.fetchAssignments(endpoint);
    }

    /**
     * List assignments by course with script
     *
     * @param courseId
     */
    async listAssignmentsByCourseWithScript(courseId: string): Promise<AssignmentInterface[]> {
        const endpoint: string = new Endpoints().LIST_ASSIGNMENTS_BY_COURSE_WITH_SCRIPT
            .replace(':version', this.version)
            .replace(':course_id', courseId);

        return this.fetchAssignments(endpoint);
    }
}