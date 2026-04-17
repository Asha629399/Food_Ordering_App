import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { Role } from '../common/enums';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private service: PaymentsService) {}

  @Get()
  findAll(@Request() req) {
    if (req.user.role === Role.ADMIN) return this.service.findAll();
    return this.service.findByUser(req.user.id);
  }

  @Post()
  create(@Request() req, @Body() body: { type: string; label: string }) {
    return this.service.create(req.user.id, body);
  }

  // Only ADMIN can update payment methods (per RBAC table)
  @Roles(Role.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Request() req, @Body() body: any) {
    return this.service.update(+id, req.user.id, req.user.role, body);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.service.remove(+id, req.user.id, req.user.role);
  }
}
