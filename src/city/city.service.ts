import { Injectable, NotFoundException } from '@nestjs/common';
import { CityEntity } from './entities/city.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class CityService {
  constructor(
    @InjectRepository(CityEntity)
    private readonly cityRepository: Repository<CityEntity>,
    private readonly cacheService: CacheService,
  ) {}

  async getAllCitiesByStateId(stateId: number): Promise<CityEntity[]> {
    return this.cacheService.getCacheData<CityEntity[]>(
      `state_${stateId}`,
      () =>
        this.cityRepository.find({
          where: {
            state_id: stateId,
          },
        }),
    );
  }

  async findCityById(city_id: number): Promise<CityEntity> {
    const city = await this.cityRepository.findOne({
      where: {
        id: city_id,
      },
    });

    if (!city) {
      throw new NotFoundException(`city_id: ${city_id} not found.`);
    }

    return city;
  }

  async findCityByName(
    city_name: string,
    state_uf: string,
  ): Promise<CityEntity> {
    const city = await this.cityRepository.findOne({
      where: {
        name: city_name,
        state: {
          uf: state_uf,
        },
      },
      relations: {
        state: true,
      },
    });

    if (!city) {
      throw new NotFoundException(`city_name: ${city_name} not found.`);
    }

    return city;
  }
}
