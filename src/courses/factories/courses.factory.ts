/*
 * MIT License
 * 
 * Copyright (c) 2024 Quantum Unit Solutions
 * Author: David Meikle
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
import {CourseInterface} from "../dtos/course.interface";
import {Endpoints} from "../config/endpoints";
import {toCamelCase} from "../../utils/case.converter";
import {CanvasHttpConnector} from "../../http/connections/canvas-http.connector";
import {HttpResponse} from "node-http-connector";

export class CoursesFactory {

    constructor(protected readonly connector: CanvasHttpConnector,
                protected version: string,
                protected accountId: string) {
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

        const response: HttpResponse<any> | undefined = await this.connector.get(endpoint);
        if (response) {
            const courses = toCamelCase(response.data);
            return courses.map((course: any) => ({
                ...course,
                id: '', // let the user generate their own local GUID
                courseId: course.id // Map API id to courseId
            }));
        }
        return [];
    }

    /**
     * Get course by id
     *
     * @param courseId
     */
   async getCourse(courseId: string): Promise<CourseInterface | undefined> {
        const endpoint: string = new Endpoints().GET_COURSE
            .replace(':version', this.version)
            .replace(':course_id', courseId)

        const response: HttpResponse<any> | undefined = await this.connector.request('GET',endpoint);
        if (response) {
            const course = toCamelCase(response.data);
            return {
                ...course,
                id:'', // Let user generate local GUID
                courseId: course.id // Map API id to courseId
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

        const response: HttpResponse<any> | undefined = await this.connector.get(endpoint);
        if (response) {
            const courses = toCamelCase(response.data);
            return courses.map((course: any) => ({
                ...course,
                id: '', // Let user generate local GUID
                courseId: course.id // Map API id to courseId
            }));
        }
        return [];
    }
}