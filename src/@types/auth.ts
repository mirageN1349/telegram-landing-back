import { Request } from 'express';

export type CurrentUser = {
  userId: Uuid;
};

export type AppRequest = Request & {
  user: CurrentUser;
};
