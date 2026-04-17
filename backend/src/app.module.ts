import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';
import { User } from './users/user.entity';
import { Restaurant } from './restaurants/restaurant.entity';
import { MenuItem } from './restaurants/menu-item.entity';
import { Order } from './orders/order.entity';
import { PaymentMethod } from './payments/payment-method.entity';
import { SeedService } from './seed.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'restaurant.db',
      entities: [User, Restaurant, MenuItem, Order, PaymentMethod],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Restaurant, MenuItem, Order, PaymentMethod]),
    AuthModule,
    UsersModule,
    RestaurantsModule,
    OrdersModule,
    PaymentsModule,
  ],
  providers: [SeedService],
})
export class AppModule {}
