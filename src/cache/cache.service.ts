import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getCacheData<T>(key: string, repository: () => Promise<T>): Promise<T> {
    const allData: T = await this.cacheManager.get(key);

    if (allData) {
      return allData;
    }

    const getDataFromDataBase: T = await repository();

    await this.cacheManager.set(key, getDataFromDataBase);

    return getDataFromDataBase;
  }
}
