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
import {CanvasHttpConnector} from "../../http/connections/canvas-http.connector";
import {SectionInterface} from "../dtos/section.interface";
import {HttpResponse} from "node-http-connector";
import {toCamelCase} from "../../utils/case.converter";
import {Endpoints} from "../config/endpoints";

export class SectionsFactory {
    constructor(
        protected readonly connector: CanvasHttpConnector,
        protected version: string,
        protected accountId: string
    ) {}

    /**
     * Fetch Sections from the API
     *
     * @param endpoint
     * @private
     */
    private async fetchSections(endpoint: string): Promise<SectionInterface[]> {
        const response: HttpResponse<any> | undefined = await this.connector.get(endpoint);
        if (response) {
            const sections: any = toCamelCase(response.data);
            const sectionPromises = sections.map(async (section: any) => ({
                ...section,
                id: '', // let the user generate their own local GUID
                sectionNumber: section.id, // Map API id to courseId
                remoteCreatedAt: section.createdAt,
                courseNumber: section.courseId,
            }));
            return await Promise.all(sectionPromises);
        }
        return [];
    }

    /**
     * List sections by course
     *
     * @param courseId
     * @param page
     * @param size
     */
    async listSectionsByCourse(courseId: number, page: number, size: number): Promise<SectionInterface[]> {
        const endpoint: string = new Endpoints().LIST_SECTIONS_BY_COURSE
            .replace(':version', this.version)
            .replace(':account_id', this.accountId)
            .replace(':course_id', courseId.toString())
            .replace(':page', page.toString())
            .replace(':size', size.toString());

        return this.fetchSections(endpoint);
    }
}