import { User } from '@repo/openapi';
import { capitalizeFirstChar } from './capitalizeFirstChar';

export function getUserName(user: User) {
    const userName = user.firstName ?? user.lastName ?? user.email ?? '';
    return capitalizeFirstChar(userName);
}
