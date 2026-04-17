import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  findByUsername(username: string) {
    return this.repo.findOne({ where: { username } });
  }

  findAll() {
    return this.repo.find({ select: ['id', 'username', 'name', 'role', 'country'] });
  }

  create(data: Partial<User>) {
    return this.repo.save(this.repo.create(data));
  }
}
