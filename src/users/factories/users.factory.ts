import { CanvasHttpConnector } from "../../http/connections/canvas-http.connector";
import { UserInterface } from "../dtos/user.interface";
import { Endpoints } from "../config/endpoints";
import { HttpResponse } from "node-http-connector";
import { toCamelCase } from "../../utils/case.converter";
import { CanvasObjectNotFoundError } from "../../exceptions/canvas-object-not-found.error";

export class UsersFactory {
    constructor(
        protected readonly connector: CanvasHttpConnector,
        protected version: string,
        protected accountId: string
    ) {}

    /**
     * Fetch users from the Canvas API
     *
     * @param endpoint
     * @private
     */
    private async fetchUsers(endpoint: string): Promise<UserInterface[]> {
        try {
            const response: HttpResponse<any> | undefined = await this.connector.get(endpoint);
            if (response) {
                const users: any = toCamelCase(response.data);
                const userPromises: any = users.map(async (user: any): Promise<UserInterface> => this.mapUser(user));
                return await Promise.all(userPromises);
            }
        } catch (error) {
            console.error(`Error fetching users: ${error}`);
        }
        return [];
    }

    /**
     * Map the user object from the Canvas API to the UserInterface
     *
     * @param user
     * @private
     */
    private mapUser(user: any): UserInterface {
        const [firstname, ...lastnameParts] = user.name.split(' ');
        const lastname: string = lastnameParts.join(' ');

        return {
            ...user,
            id: '', // let the user generate their own local GUID
            userNumber: user.id, // Map API id to termId
            firstname,
            lastname,
        };
    }

    /**
     * List users by course ID
     *
     * @param courseId
     * @param page
     * @param size
     */
    async listUsersByCourse(courseId: string, page: number, size: number): Promise<UserInterface[]> {
        const endpoint: string = new Endpoints().LIST_USERS_BY_COURSE
            .replace(':version', this.version)
            .replace(':course_id', courseId)
            .replace(':page', page.toString())
            .replace(':size', size.toString());

        return this.fetchUsers(endpoint);
    }

    /**
     * Get a user by their user ID
     *
     * @param userId
     */
    async getUser(userId: string): Promise<UserInterface> {
        const endpoint: string = new Endpoints().GET_USER
            .replace(':version', this.version)
            .replace(':user_id', userId);

        try {
            const response: HttpResponse<any> | undefined = await this.connector.get(endpoint);
            if (response) {
                const user: any = toCamelCase(response.data);
                return this.mapUser(user);
            }
        } catch (error) {
            console.error(`Error fetching user: ${error}`);
        }

        throw new CanvasObjectNotFoundError(userId);
    }

    /**
     * Search users by a search term
     *
     * @param searchterm
     */
    async searchUsers(searchterm: string): Promise<UserInterface[]> {
        const endpoint: string = new Endpoints().SEARCH_USERS
            .replace(':version', this.version)
            .replace(':account_id', this.accountId)
            .replace(':term', searchterm);

        return this.fetchUsers(endpoint);
    }
}