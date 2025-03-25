import { CanvasHttpConnector } from "../../http/connections/canvas-http.connector";
import { OutcomeInterface } from "../dtos/outcome.interface";
import { Endpoints } from "../config/endpoints";
import { HttpResponse } from "node-http-connector";
import { toCamelCase } from "../../utils/case.converter";
import { OutcomeGroupInterface } from "../dtos/outcome-group.interface";

export class OutcomesFactory {
    constructor(
        protected readonly connector: CanvasHttpConnector,
        protected version: string,
        protected accountId: string
    ) {}

    /**
     * Fetch outcomes
     *
     * @param endpoint
     * @private
     */
    private async fetchOutcomes(endpoint: string): Promise<OutcomeInterface[]> {
        try {
            const response: HttpResponse<any> | undefined = await this.connector.get(endpoint);
            if (response) {
                const outcomes: any = toCamelCase(response.data);
                const outcomePromises = outcomes.outcomeResults.map(async (outcome: any) => this.mapOutcome(outcome));
                return await Promise.all(outcomePromises);
            }
        } catch (error) {
            console.error(`Error fetching outcomes: ${error}`);
        }
        return [];
    }

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
     * Map outcome
     *
     * @param outcome
     * @private
     */
    private mapOutcome(outcome: any): OutcomeInterface {
        return {
            ...outcome,
            id: '', // let the user generate their own local GUID
            outcomeNumber: outcome.id // Map API id to termId
        };
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
     * Get outcome
     *
     * @param id
     */
    async getOutcome(id: string): Promise<OutcomeInterface[]> {
        const endpoint: string = new Endpoints().GET_OUTCOME
            .replace(':version', this.version)
            .replace(':id', id);

        return this.fetchOutcomes(endpoint);
    }

    /**
     * List outcome results by course
     *
     * @param courseId
     * @param page
     * @param size
     */
    async listOutcomeResultsByCourse(courseId: string, page: number, size: number): Promise<OutcomeInterface[]> {
        const endpoint: string = new Endpoints().LIST_OUTCOME_RESULTS_BY_COURSE
            .replace(':version', this.version)
            .replace(':course_id', courseId)
            .replace(':page', page.toString())
            .replace(':size', size.toString());

        return this.fetchOutcomes(endpoint);
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
        const userIdsParam: string = userIds.map(id => `user_ids[]=${id}`).join('&');
        const endpoint: string = new Endpoints().LIST_OUTCOME_RESULTS_BY_STUDENTS
            .replace(':version', this.version)
            .replace(':course_id', courseId)
            .replace(':page', page.toString())
            .replace(':size', size.toString())
            .concat(`&${userIdsParam}`);

        return this.fetchOutcomes(endpoint);
    }

    /**
     * List outcomes rollup
     *
     * @param courseId
     */
    async listOutcomesRollup(courseId: string): Promise<OutcomeInterface[]> {
        const endpoint: string = new Endpoints().LIST_OUTCOMES_ROLLUP
            .replace(':version', this.version)
            .replace(':course_id', courseId);

        return this.fetchOutcomes(endpoint);
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