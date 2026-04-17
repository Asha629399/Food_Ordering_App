import { Controller, Get, Post, Patch, Param, Body, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { Role } from '../common/enums';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('orders')
export class OrdersController {
  constructor(private service: OrdersService) {}

  @Get()
  findAll(@Request() req) {
    return this.service.findAll(req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Post()
  create(@Request() req, @Body() body: { restaurantId: number; items: { menuItemId: number; quantity: number }[] }) {
    return this.service.createOrder(req.user.id, body.restaurantId, body.items, req.user.country);
  }

  @Roles(Role.ADMIN, Role.MANAGER)
  @Patch(':id/place')
  place(@Param('id') id: string, @Request() req, @Body() body: { paymentMethodId: number }) {
    return this.service.placeOrder(+id, req.user, body.paymentMethodId);
  }

  @Roles(Role.ADMIN, Role.MANAGER)
  @Patch(':id/cancel')
  cancel(@Param('id') id: string, @Request() req) {
    return this.service.cancelOrder(+id, req.user);
  }
}
