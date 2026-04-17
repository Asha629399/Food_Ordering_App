import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentMethod } from './payment-method.entity';
import { Role } from '../common/enums';

@Injectable()
export class PaymentsService {
  constructor(@InjectRepository(PaymentMethod) private repo: Repository<PaymentMethod>) {}

  findByUser(userId: number) {
    return this.repo.find({ where: { user: { id: userId } } });
  }

  findAll() {
    return this.repo.find({ relations: ['user'] });
  }

  async create(userId: number, data: { type: string; label: string }) {
    const pm = this.repo.create({ user: { id: userId } as any, ...data });
    return this.repo.save(pm);
  }

  async update(id: number, userId: number, userRole: Role, data: Partial<{ type: string; label: string; isDefault: boolean }>) {
    const pm = await this.repo.findOne({ where: { id }, relations: ['user'] });
    if (!pm) throw new NotFoundException('Payment method not found');
    if (userRole !== Role.ADMIN && pm.user.id !== userId) throw new ForbiddenException('Not your payment method');
    Object.assign(pm, data);
    return this.repo.save(pm);
  }

  async remove(id: number, userId: number, userRole: Role) {
    const pm = await this.repo.findOne({ where: { id }, relations: ['user'] });
    if (!pm) throw new NotFoundException('Payment method not found');
    if (userRole !== Role.ADMIN && pm.user.id !== userId) throw new ForbiddenException('Not your payment method');
    return this.repo.remove(pm);
  }
}
