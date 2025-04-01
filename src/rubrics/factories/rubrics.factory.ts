
import { Endpoints } from "../config/endpoints";
import { toCamelCase } from "../../utils/case.converter";
import { CanvasHttpConnector } from "../../http/connections/canvas-http.connector";
import { HttpResponse } from "node-http-connector";
import {RubricInterface} from "../dtos/rubric.interface";

export class RubricsFactory {
    constructor(
        protected readonly connector: CanvasHttpConnector,
        protected version: string,
        protected accountId: string
    ) {}

    /**
     * Fetch rubrics from the API
     *
     * @param endpoint
     * @private
     */
    private async fetchRubrics(endpoint: string): Promise<RubricInterface[]> {
        const response: HttpResponse<any> | undefined = await this.connector.get(endpoint);
        if (response) {
            const rubrics: any = toCamelCase(response.data);
            const rubricPromises = rubrics.map(async (rubric: RubricInterface) => ({
                ...rubric,
                id: '', // let the user generate their own local GUID
                rubricNumber: rubric.id // Map API id to courseId

            }));
            return await Promise.all(rubricPromises);
        }
        return [];
    }

    /**
     * List rubrics by course
     *
     * @param courseId
     * @param page
     * @param size
     */
    async listRubrics(courseId: number, page: number, size: number): Promise<RubricInterface[]> {
        const endpoint: string = new Endpoints().LIST_RUBRICS_BY_COURSE
            .replace(':version', this.version)
            .replace(':account_id', this.accountId)
            .replace(':course_id', courseId.toString())
            .replace(':page', page.toString())
            .replace(':size', size.toString());

        return this.fetchRubrics(endpoint);
    }

}