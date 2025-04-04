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
     * Fetch outcome - system only returns one outcome
     *
     * @param endpoint
     * @private
     */
    private async fetchOutcome(endpoint: string): Promise<OutcomeInterface | undefined> {
        try {
            const response: HttpResponse<any> | undefined = await this.connector.get(endpoint);
            if (response) {
                const outcome: any = toCamelCase(response.data);
              return  this.mapOutcome(outcome);
            }
        } catch (error) {
            console.error(`Error fetching outcomes: ${error}`);
        }
    }

    // async listOutcomesByCourse(courseId: number, page: number, size: number): Promise<OutcomeInterface[]> {
    //     const endpoint: string = new Endpoints().
    //         .replace(':version', this.version)
    //         .replace(':account_id', this.accountId)
    //         .replace(':course_id', courseId.toString())
    //         .replace(':page', page.toString())
    //         .replace(':size', size.toString());
    //
    //     return this.fetchOutcomes(endpoint);
    // }

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
    async getOutcome(id: string): Promise<OutcomeInterface | undefined> {
        const endpoint: string = new Endpoints().GET_OUTCOME
            .replace(':version', this.version)
            .replace(':id', id);

            return await this.fetchOutcome(endpoint);

    }



}