import { api } from '@/api';
import { Accounting } from '@repo/openapi';
import { IAccounting } from '@repo/shared';

export async function accountingFindAll(): Promise<Accounting[]> {
    const response = await api.accountingFindAll();
    return response.data.sort((a: IAccounting, b: IAccounting) =>
        a.name.toUpperCase().localeCompare(b.name.toUpperCase()),
    );
}

export async function accountingFindOne(id: number): Promise<Accounting> {
    const response = await api.accountingFindOne(id);
    return response.data;
}
