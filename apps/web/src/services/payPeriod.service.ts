import { api } from '@/api';
import {
    ClosePayPeriodDto,
    FindAllPayPeriodDto,
    FindCurrentPayPeriodDto,
    FindOnePayPeriodDto,
    OpenPayPeriodDto,
} from '@repo/openapi';

export async function payPeriodsFindAll(params: FindAllPayPeriodDto) {
    const response = (await api.payPeriodsFindAll(params)).data;
    return response.sort((a, b) => a.dateFrom.getTime() - b.dateFrom.getTime());
}

export async function payPeriodsFindOne(id: number, options?: FindOnePayPeriodDto) {
    return (await api.payPeriodsFindOne(id, options ?? {})).data;
}

export async function payPeriodsFindCurrent(params: FindCurrentPayPeriodDto) {
    return (await api.payPeriodsFindCurrent(params)).data;
}

export async function payPeriodsClose(id: number, params: ClosePayPeriodDto) {
    return (await api.payPeriodsClose(id, params)).data;
}

export async function payPeriodsOpen(id: number, params: OpenPayPeriodDto) {
    return (await api.payPeriodsOpen(id, params)).data;
}
