import { api } from '@/api';
import { FindAllPaymentTypeDto } from '@repo/openapi';

export async function paymentTypesFindAll(params?: FindAllPaymentTypeDto) {
    const response = (await api.paymentTypesFindAll(params ?? {})).data;
    return response.sort((a, b) => a.name.toUpperCase().localeCompare(b.name.toUpperCase()));
}
