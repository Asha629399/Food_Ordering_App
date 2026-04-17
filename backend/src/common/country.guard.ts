import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Role } from './enums';

/**
 * Ensures managers and members can only access data from their own country.
 * Admins bypass this check.
 * Attach to routes that have :country param or a country in the resource.
 */
@Injectable()
export class CountryGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    if (user.role === Role.ADMIN) return true;

    const resourceCountry: string =
      req.params?.country || req.body?.country || req.query?.country;

    if (resourceCountry && resourceCountry.toLowerCase() !== user.country.toLowerCase()) {
      throw new ForbiddenException('Access restricted to your country only');
    }
    return true;
  }
}
