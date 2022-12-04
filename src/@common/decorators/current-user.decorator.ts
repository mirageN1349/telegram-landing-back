import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AppRequest, CurrentUser as CurrentUserData } from 'src/@types/auth';

export const CurrentUser = createParamDecorator(
  (data: keyof CurrentUserData, context: ExecutionContext) => {
    const req: AppRequest = context.switchToHttp().getRequest();
    return data ? req?.user[data] : req.user;
  },
);
