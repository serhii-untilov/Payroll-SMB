import { IUser } from 'shared';

export class User implements IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  isActive: boolean;
}
