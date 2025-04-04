import { CanvasHttpConnector } from "../../http/connections/canvas-http.connector";
import { Endpoints } from "../config/endpoints";
import { HttpResponse } from "node-http-connector";
import { toCamelCase } from "../../utils/case.converter";
import {OutcomeRollupInterface} from "../dtos/outcome-rollup.interface";

export class OutcomeRollupsFactory {
    constructor(
        protected readonly connector: CanvasHttpConnector,
        protected version: string,
        protected accountId: string
    ) {}

    private async fetchOutcomeRollups(endpoint: string): Promise<OutcomeRollupInterface[]> {
        try {
            const response: HttpResponse<any> | undefined = await this.connector.get(endpoint);
            if (response) {
                const outcomeRollups: any = toCamelCase(response.data);
                return outcomeRollups.rollups.map((outcomeRollup: any) => this.mapOutcomeRollup(outcomeRollup));
            }
        } catch (error) {
            console.error(`Error fetching outcome rollups: ${error}`);
        }
        return [];
    }


    /**
     * List outcome rollups by course     *
     * @param courseId
     * @param page
     * @param size
     */
    async listOutcomeRollupsByCourse(courseId: string, page: number, size: number): Promise<OutcomeRollupInterface[]> {
        const endpoint: string = new Endpoints().LIST_OUTCOMES_ROLLUP
            .replace(':version', this.version)
            .replace(':course_id', courseId)
            .replace(':page', page.toString())
            .replace(':size', size.toString());

        return this.fetchOutcomeRollups(endpoint);
    }

    /**
     * Get an outcome rollup by ID
     *
     * @param outcomeRollup
     * @private
     */
    private mapOutcomeRollup(outcomeRollup: any): OutcomeRollupInterface {
        return {
            ...outcomeRollup,
            id: '', // let the user generate their own local GUID
            outcomeRollupNumber: outcomeRollup.id // Map API id to termId
        };
    }

}