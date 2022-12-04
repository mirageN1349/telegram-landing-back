import { Injectable } from '@nestjs/common';
import { Role, role_key } from '@prisma/client';

@Injectable()
export class RoleService {
  checkAccess(roles: Role[] = [], role: role_key): Access {
    return roles.some((r) => r.key === role);
  }
}
