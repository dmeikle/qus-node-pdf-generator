import { CanvasHttpConnector } from "../../http/connections/canvas-http.connector";
import { OutcomeInterface } from "../dtos/outcome.interface";
import { Endpoints } from "../config/endpoints";
import { HttpResponse } from "node-http-connector";
import { toCamelCase } from "../../utils/case.converter";
import { OutcomeGroupInterface } from "../dtos/outcome-group.interface";

export class OutcomeGroupsFactory {
    constructor(
        protected readonly connector: CanvasHttpConnector,
        protected version: string,
        protected accountId: string
    ) {}



    /**
     * Fetch outcome groups
     *
     * @param endpoint
     * @private
     */
    private async fetchOutcomeGroups(endpoint: string): Promise<OutcomeGroupInterface[]> {
        try {
            const response: HttpResponse<any> | undefined = await this.connector.get(endpoint);
            if (response) {
                const outcomeGroups: any = toCamelCase(response.data);
                return outcomeGroups.map((outcomeGroup: any) => this.mapOutcomeGroup(outcomeGroup));
            }
        } catch (error) {
            console.error(`Error fetching outcome groups: ${error}`);
        }
        return [];
    }


    /**
     * Map outcome group
     *
     * @param outcomeGroup
     * @private
     */
    private mapOutcomeGroup(outcomeGroup: any): OutcomeGroupInterface {
        return {
            ...outcomeGroup,
            id: '', // let the user generate their own local GUID
            outcomeGroupNumber: outcomeGroup.id // Map API id to termId
        };
    }


    /**
     * List outcome groups by course
     *
     * @param courseId
     * @param page
     * @param size
     */
    async listOutcomeGroupsByCourse(courseId: string, page: number, size: number): Promise<OutcomeGroupInterface[]> {
        const endpoint: string = new Endpoints().LIST_OUTCOME_GROUPS_BY_COURSE
            .replace(':version', this.version)
            .replace(':course_id', courseId)
            .replace(':page', page.toString())
            .replace(':size', size.toString());

        return this.fetchOutcomeGroups(endpoint);
    }
}