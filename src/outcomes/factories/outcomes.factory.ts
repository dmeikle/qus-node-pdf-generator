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
import {OutcomeInterface} from "../dtos/outcome.interface";
import {Endpoints} from "../config/endpoints";
import {HttpResponse} from "node-http-connector";
import {toCamelCase} from "../../utils/case.converter";
import {AssignmentInterface} from "../../assignments/dtos/assignment.interface";

export class OutcomesFactory {

    constructor(protected readonly connector: CanvasHttpConnector,
                protected version: string,
                protected accountId: string) {
    }

    /**
     * Get outcome
     *
     * @param id
     */
    async getOutcome(id: string): Promise<OutcomeInterface[]> {
        const endpoint: string = new Endpoints().GET_OUTCOME
            .replace(':version', this.version)
            .replace(':id', id);

        const response: HttpResponse<any> | undefined = await this.connector.get(endpoint);
        if (response) {
            return toCamelCase(response.data);
        }
        return [];
    }

    /**
     * List outcomes
     *
     * @param courseId
     * @param page
     * @param size
     */
    async listOutcomeResults(courseId: string, page: number, size: number): Promise<OutcomeInterface[]> {
        const endpoint: string = new Endpoints().LIST_OUTCOME_RESULTS
            .replace(':version', this.version)
            .replace(':course_id', courseId)
            .replace(':page', page.toString())
            .replace(':size', size.toString());

        const response: HttpResponse<any> | undefined = await this.connector.get(endpoint);
        if (response) {
            return toCamelCase(response.data);
        }
        return [];
    }

    /**
     * List outcome results for students
     *
     * @param courseId
     * @param userIds
     * @param page
     * @param size
     */
    async listOutcomeResultsForStudents(courseId: string, userIds: string[], page: number, size: number): Promise<OutcomeInterface[]> {
        const userIdsParam = userIds.map(id => `user_ids[]=${id}`).join('&');
        const endpoint: string = new Endpoints().LIST_OUTCOME_RESULTS_BY_STUDENTS
            .replace(':version', this.version)
            .replace(':course_id', courseId)
            .replace(':page', page.toString())
            .replace(':size', size.toString())
            .concat(`&${userIdsParam}`);

        const response: HttpResponse<any> | undefined = await this.connector.get(endpoint);
        if (response) {
            return toCamelCase(response.data);
        }
        return [];
    }

    /**
     * List outcome results rollup
     *
     * @param courseId
     */
    async listOutcomeResultsRollup(courseId: string): Promise<OutcomeInterface[]> {

        const endpoint: string = new Endpoints().LIST_OUTCOME_RESULTS_ROLLUP
            .replace(':version', this.version)
            .replace(':course_id', courseId);

        const response: HttpResponse<any> | undefined = await this.connector.get(endpoint);
        if (response) {
            return toCamelCase(response.data);
        }
        return [];
    }

}