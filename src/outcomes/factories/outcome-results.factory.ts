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
import {HttpResponse} from "node-http-connector";
import {toCamelCase} from "../../utils/case.converter";
import { OutcomeResultInterface } from "../dtos/outcome-result.interface";
import {Endpoints} from "../config/endpoints";

export class OutcomeResultsFactory {
    constructor(
        protected readonly connector: CanvasHttpConnector,
        protected version: string,
        protected accountId: string
    ) {}

    /**
     * Fetch outcomeResults from the API
     *
     * @param endpoint
     * @private
     */
    private async fetchOutcomeResults(endpoint: string): Promise<OutcomeResultInterface[]> {
        const response: HttpResponse<any> | undefined = await this.connector.get(endpoint);
        if (response) {
            const outcomeResults: any = toCamelCase(response.data);
            const outcomeResultPromises = outcomeResults.outcomeResults.map(async (outcomeResult: OutcomeResultInterface) => ({
                ...outcomeResult,
                id: '', // let the user generate their own local GUID
                outcomeResultNumber: outcomeResult.id // Map API id to courseId

            }));
            return await Promise.all(outcomeResultPromises);
        }
        return [];
    }

    /**
     * List outcomeResults by course
     *
     * @param courseId
     * @param page
     * @param size
     */
    async listOutcomeResults(courseId: number, page: number, size: number): Promise<OutcomeResultInterface[]> {
        const endpoint: string = new Endpoints().LIST_OUTCOME_RESULTS_BY_COURSE
            .replace(':version', this.version)
            .replace(':account_id', this.accountId)
            .replace(':course_id', courseId.toString())
            .replace(':page', page.toString())
            .replace(':size', size.toString());

        return this.fetchOutcomeResults(endpoint);
    }
}