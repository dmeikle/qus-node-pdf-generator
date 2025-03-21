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
import {HttpClient, HttpResponse} from "node-http-connector";

export abstract class CanvasHttpConnector extends HttpClient {
    private serviceIdentifier: string | undefined;

    constructor(canvasBaseUrl: string, protected readonly headers: Record<string, string>) {
        super(canvasBaseUrl);
        this.enableLogging();
        this.setAuthToken(headers.token);
    }

    protected addServiceIdentifierHeader(headers: HeadersInit): HeadersInit {
        return {
            ...headers,
            'X-Service-Identifier': this.serviceIdentifier ?? '',
        };
    }

    async request(
        method: string,
        endpoint: string,
        data: any = null,
        config: any = {},
    ): Promise<HttpResponse<any> | undefined> {
        config = config || { headers: this.headers };
        const headers: HeadersInit = this.addServiceIdentifierHeader(config.headers || this.headers);
        return super.request(method, endpoint, data, { ...config, headers });
    }

}