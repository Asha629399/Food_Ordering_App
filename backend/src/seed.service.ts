import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './users/user.entity';
import { Restaurant } from './restaurants/restaurant.entity';
import { MenuItem } from './restaurants/menu-item.entity';
import { PaymentMethod } from './payments/payment-method.entity';
import { Role, Country } from './common/enums';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(User) private users: Repository<User>,
    @InjectRepository(Restaurant) private restaurants: Repository<Restaurant>,
    @InjectRepository(MenuItem) private menuItems: Repository<MenuItem>,
    @InjectRepository(PaymentMethod) private payments: Repository<PaymentMethod>,
  ) {}

  async onApplicationBootstrap() {
    const count = await this.users.count();
    if (count > 0) return;

    const hash = (p: string) => bcrypt.hash(p, 10);

    const [fury, marvel, america, thanos, thor, travis] = await this.users.save([
      { username: 'nick_fury', password: await hash('fury123'), name: 'Nick Fury', role: Role.ADMIN, country: Country.AMERICA },
      { username: 'captain_marvel', password: await hash('marvel123'), name: 'Captain Marvel', role: Role.MANAGER, country: Country.INDIA },
      { username: 'captain_america', password: await hash('america123'), name: 'Captain America', role: Role.MANAGER, country: Country.AMERICA },
      { username: 'thanos', password: await hash('thanos123'), name: 'Thanos', role: Role.MEMBER, country: Country.INDIA },
      { username: 'thor', password: await hash('thor123'), name: 'Thor', role: Role.MEMBER, country: Country.INDIA },
      { username: 'travis', password: await hash('travis123'), name: 'Travis', role: Role.MEMBER, country: Country.AMERICA },
    ]);

    const r1 = await this.restaurants.save({ name: 'Spice Garden', cuisine: 'Indian', country: Country.INDIA, address: 'MG Road, Bangalore' });
    const r2 = await this.restaurants.save({ name: 'Curry House', cuisine: 'Indian', country: Country.INDIA, address: 'Connaught Place, Delhi' });
    const r3 = await this.restaurants.save({ name: 'Burger Barn', cuisine: 'American', country: Country.AMERICA, address: '5th Ave, New York' });
    const r4 = await this.restaurants.save({ name: 'Pizza Palace', cuisine: 'Italian-American', country: Country.AMERICA, address: 'Sunset Blvd, LA' });

    await this.menuItems.save([
      { name: 'Butter Chicken', price: 350, category: 'Main Course', restaurant: r1 },
      { name: 'Paneer Tikka', price: 280, category: 'Starter', restaurant: r1 },
      { name: 'Garlic Naan', price: 60, category: 'Bread', restaurant: r1 },
      { name: 'Dal Makhani', price: 220, category: 'Main Course', restaurant: r2 },
      { name: 'Samosa', price: 40, category: 'Snack', restaurant: r2 },
      { name: 'Mango Lassi', price: 80, category: 'Beverage', restaurant: r2 },
      { name: 'Classic Burger', price: 12, category: 'Main', restaurant: r3 },
      { name: 'Cheese Fries', price: 8, category: 'Sides', restaurant: r3 },
      { name: 'Milkshake', price: 6, category: 'Beverage', restaurant: r3 },
      { name: 'Margherita Pizza', price: 15, category: 'Main', restaurant: r4 },
      { name: 'Caesar Salad', price: 10, category: 'Salad', restaurant: r4 },
      { name: 'Tiramisu', price: 8, category: 'Dessert', restaurant: r4 },
    ]);

    await this.payments.save([
      { user: fury, type: 'card', label: 'Visa ending 4242', isDefault: true },
      { user: marvel, type: 'upi', label: 'marvel@upi', isDefault: true },
      { user: america, type: 'card', label: 'Mastercard ending 1234', isDefault: true },
      { user: thanos, type: 'wallet', label: 'Thanos Wallet', isDefault: true },
      { user: thor, type: 'upi', label: 'thor@upi', isDefault: true },
      { user: travis, type: 'card', label: 'Amex ending 5678', isDefault: true },
    ]);

    console.log('✅ Seed data loaded');
  }
}
