import { UpdateUserDto } from '@repo/openapi';
import { api } from '@/api';

export async function usersUpdate(id: number, payload: UpdateUserDto) {
    return (await api.usersUpdate(id, payload)).data;
}
