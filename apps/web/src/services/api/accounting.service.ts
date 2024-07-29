import { api } from '@/api';

export async function accountingFindAll() {
    const response = (await api.accountingFindAll()).data;
    return response.sort((a, b) => a.name.toUpperCase().localeCompare(b.name.toUpperCase()));
}

export async function accountingFindOne(id: number) {
    return (await api.accountingFindOne(id)).data;
}
