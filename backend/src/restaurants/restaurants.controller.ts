import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Role } from '../common/enums';

@UseGuards(JwtAuthGuard)
@Controller('restaurants')
export class RestaurantsController {
  constructor(private service: RestaurantsService) {}

  @Get()
  findAll(@Request() req) {
    // Admin sees all; managers/members see only their country
    const user = req.user;
    if (user.role === Role.ADMIN) return this.service.findAll();
    return this.service.findAll(user.country);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }
}
