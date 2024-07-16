import { CreatePersonDto, UpdatePersonDto } from '@repo/openapi';
import { api } from '@/api';

export async function personsCreate(person: CreatePersonDto) {
    return (await api.personsCreate(person)).data;
}

export async function personsFindAll() {
    return (await api.personsFindAll()).data;
}

export async function personsFindOne(id: number) {
    return (await api.personsFindOne(id)).data;
}

export async function personsUpdate(id: number, payload: UpdatePersonDto) {
    return (await api.personsUpdate(id, payload)).data;
}

export async function personsRemove(id: number) {
    return (await api.personsRemove(id)).data;
}
