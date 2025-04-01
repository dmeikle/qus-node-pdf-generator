import { CanvasHttpConnector } from "../../http/connections/canvas-http.connector";
import { OutcomeInterface } from "../dtos/outcome.interface";
import { Endpoints } from "../config/endpoints";
import { HttpResponse } from "node-http-connector";
import { toCamelCase } from "../../utils/case.converter";

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



}