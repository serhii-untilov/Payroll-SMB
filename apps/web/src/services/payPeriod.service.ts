import { api } from '@/api';
import { FindAllPayPeriodDto, FindCurrentPayPeriodDto } from '@repo/openapi';

export async function payPeriodsFindAll(params: FindAllPayPeriodDto) {
    const response = (await api.payPeriodsFindAll(params)).data;
    return response.sort((a, b) => a.dateFrom.getTime() - b.dateFrom.getTime());
}

export async function payPeriodsFindCurrent(params: FindCurrentPayPeriodDto) {
    return (await api.payPeriodsFindCurrent(params)).data;
}

export async function payPeriodsClose(id: number) {
    return (await api.payPeriodsClose(id)).data;
}

export async function payPeriodsOpen(id: number) {
    return (await api.payPeriodsOpen(id)).data;
}
