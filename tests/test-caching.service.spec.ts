import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { CachingService } from '../src/caching-service';
import { RedisClientType } from 'redis';

class TestDto {
    id: string;
    constructor(id: string) {
        this.id = id;
    }
}

class TestCachingServiceSpec extends CachingService<TestDto> {
    constructor() {
        super(60, 'test:');
    }

    public async publicGetFromCache(key: string, fetchData: (...args: any[]) => Promise<TestDto>, ...args: any[]): Promise<TestDto> {
        return this.getFromCache(key, fetchData, ...args);
    }
}

describe('CachingService', () => {
    let service: TestCachingServiceSpec;
    let client: RedisClientType;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [TestCachingServiceSpec],
        }).compile();

        service = module.get<TestCachingServiceSpec>(TestCachingServiceSpec);
        client = service['_client'] as RedisClientType;
    });

    afterEach(async () => {
        await client.quit();
    });

    it('should return cached data if it exists', async () => {
        const key = '123';
        const cachedData = new TestDto(key);
        jest.spyOn(client, 'exists').mockResolvedValue(1);
        jest.spyOn(client, 'get').mockResolvedValue(JSON.stringify(cachedData));

        const result = await service.publicGetFromCache(key, async () => new TestDto(key));

        expect(result).toEqual(cachedData);
    });

    it('should fetch data and cache it if it does not exist', async () => {
        const key = '123';
        const fetchedData = new TestDto(key);
        jest.spyOn(client, 'exists').mockResolvedValue(0);
        jest.spyOn(client, 'get').mockResolvedValue(null);
        jest.spyOn(client, 'setEx').mockResolvedValue('OK');

        const fetchData = jest.fn().mockResolvedValue(fetchedData);

        const result = await service.publicGetFromCache(key, fetchData);

        expect(result).toEqual(fetchedData);
        expect(fetchData).toHaveBeenCalledWith(key);
        expect(client.setEx).toHaveBeenCalledWith(`test:${key}`, 60, JSON.stringify(fetchedData));
    });
});