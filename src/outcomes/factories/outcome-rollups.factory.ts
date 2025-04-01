import { CanvasHttpConnector } from "../../http/connections/canvas-http.connector";
import { OutcomeInterface } from "../dtos/outcome.interface";
import { Endpoints } from "../config/endpoints";
import { HttpResponse } from "node-http-connector";
import { toCamelCase } from "../../utils/case.converter";
import { OutcomeGroupInterface } from "../dtos/outcome-group.interface";
import {OutcomeRollupInterface} from "../dtos/outcome-rollup.interface";

export class OutcomeRollupsFactory {
    constructor(
        protected readonly connector: CanvasHttpConnector,
        protected version: string,
        protected accountId: string
    ) {}

    private async fetchOutcomeRollups(endpoint: string): Promise<OutcomeGroupInterface[]> {
        try {
            const response: HttpResponse<any> | undefined = await this.connector.get(endpoint);
            if (response) {
                const outcomeRollups: any = toCamelCase(response.data);
                return outcomeRollups.map((outcomeRollup: any) => this.mapOutcomeRollup(outcomeRollup));
            }
        } catch (error) {
            console.error(`Error fetching outcome rollups: ${error}`);
        }
        return [];
    }


    /**
     * List outcome groups by course
     *
     * @param courseId
     * @param page
     * @param size
     */
    async listOutcomeGroupsByCourse(courseId: string, page: number, size: number): Promise<OutcomeGroupInterface[]> {
        const endpoint: string = new Endpoints().LIST_OUTCOMES_ROLLUP
            .replace(':version', this.version)
            .replace(':course_id', courseId)
            .replace(':page', page.toString())
            .replace(':size', size.toString());

        return this.fetchOutcomeRollups(endpoint);
    }
    private mapOutcomeRollup(outcomeRollup: any): OutcomeRollupInterface {
        return {
            ...outcomeRollup,
            id: '', // let the user generate their own local GUID
            outcomeRollupNumber: outcomeRollup.id // Map API id to termId
        };
    }

}