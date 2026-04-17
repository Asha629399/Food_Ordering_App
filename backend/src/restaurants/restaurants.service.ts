import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from './restaurant.entity';
import { Country } from '../common/enums';

@Injectable()
export class RestaurantsService {
  constructor(@InjectRepository(Restaurant) private repo: Repository<Restaurant>) {}

  findAll(country?: Country) {
    if (country) return this.repo.find({ where: { country } });
    return this.repo.find();
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id } });
  }
}
