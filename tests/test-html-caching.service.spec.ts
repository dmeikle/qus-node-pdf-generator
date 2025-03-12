import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { RedisClientType } from 'redis';
import { StringCachingService } from '../src/string-caching.service';

class TestHtmlCachingServiceSpec extends StringCachingService {
    constructor() {
        super(60, 'html:');
    }

    public async publicGetFromCache(key: string, fetchData: (...args: any[]) => Promise<string>, ...args: any[]): Promise<string> {
        return this.getFromCache(key, fetchData, ...args);
    }
}

describe('HtmlCachingService', () => {
    let service: TestHtmlCachingServiceSpec;
    let client: RedisClientType;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [TestHtmlCachingServiceSpec],
        }).compile();

        service = module.get<TestHtmlCachingServiceSpec>(TestHtmlCachingServiceSpec);
        client = service['_client'] as RedisClientType;
    });

    afterEach(async () => {
        await client.quit();
    });

    it('should cache and retrieve an HTML page as a string', async () => {
        const key = 'page1';
        const htmlContent = '<html><body><h1>Hello, World!</h1></body></html>';
        jest.spyOn(client, 'exists').mockResolvedValue(0);
        jest.spyOn(client, 'get').mockResolvedValue(null);
        jest.spyOn(client, 'setEx').mockResolvedValue('OK');

        const fetchHtmlPage = jest.fn().mockResolvedValue(htmlContent);

        // Cache the HTML page
        const cachedPage = await service.publicGetFromCache(key, fetchHtmlPage);

        expect(cachedPage).toEqual(htmlContent);
        expect(fetchHtmlPage).toHaveBeenCalledWith(key);
        expect(client.setEx).toHaveBeenCalledWith(`html:${key}`, 60, htmlContent);

        // Retrieve the cached HTML page
        jest.spyOn(client, 'exists').mockResolvedValue(1);
        jest.spyOn(client, 'get').mockResolvedValue(htmlContent);

        const retrievedPage = await service.publicGetFromCache(key, fetchHtmlPage);

        expect(retrievedPage).toEqual(htmlContent);
    });
});