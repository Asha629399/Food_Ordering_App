import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { RestaurantsService } from '../restaurants/restaurants.service';
import { OrderStatus, Role, Country } from '../common/enums';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private repo: Repository<Order>,
    private restaurants: RestaurantsService,
  ) {}

  async createOrder(userId: number, restaurantId: number, items: { menuItemId: number; quantity: number }[], userCountry: Country) {
    const restaurant = await this.restaurants.findOne(restaurantId);
    if (!restaurant) throw new NotFoundException('Restaurant not found');
    if (restaurant.country !== userCountry) throw new ForbiddenException('Restaurant not in your country');

    const orderItems = items.map((i) => {
      const menuItem = restaurant.menuItems.find((m) => m.id === i.menuItemId);
      if (!menuItem) throw new NotFoundException(`Menu item ${i.menuItemId} not found`);
      return { menuItemId: i.menuItemId, name: menuItem.name, price: +menuItem.price, quantity: i.quantity };
    });

    const total = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const order = this.repo.create({ user: { id: userId } as any, restaurant: { id: restaurantId } as any, items: orderItems, total, country: userCountry });
    return this.repo.save(order);
  }

  findAll(user: { id: number; role: Role; country: Country }) {
    if (user.role === Role.ADMIN) return this.repo.find({ relations: ['user', 'restaurant'] });
    return this.repo.find({ where: { country: user.country }, relations: ['user', 'restaurant'] });
  }

  async findOne(id: number) {
    const order = await this.repo.findOne({ where: { id }, relations: ['user', 'restaurant'] });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async placeOrder(id: number, user: { id: number; role: Role; country: Country }, paymentMethodId: number) {
    const order = await this.findOne(id);
    this.checkAccess(order, user);
    if (order.status !== OrderStatus.PENDING) throw new BadRequestException('Order already processed');
    order.status = OrderStatus.PLACED;
    return this.repo.save(order);
  }

  async cancelOrder(id: number, user: { id: number; role: Role; country: Country }) {
    const order = await this.findOne(id);
    this.checkAccess(order, user);
    if (order.status === OrderStatus.CANCELLED) throw new BadRequestException('Already cancelled');
    order.status = OrderStatus.CANCELLED;
    return this.repo.save(order);
  }

  private checkAccess(order: Order, user: { id: number; role: Role; country: Country }) {
    if (user.role !== Role.ADMIN && order.country !== user.country) {
      throw new ForbiddenException('Access restricted to your country only');
    }
  }
}
