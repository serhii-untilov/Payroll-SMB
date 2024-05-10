import { ICreatePosition, IPosition, IUpdatePosition } from '@repo/shared';
import { api } from '../api';
import authHeader from './auth-header';

export async function createPosition(position: ICreatePosition): Promise<IPosition> {
    const response = await api.post(`/api/positions/`, position, { headers: authHeader() });
    return response.data;
}

export async function getPositionList(params: {
    companyId: number;
    relations?: boolean;
    onDate?: Date;
    onPayPeriodDate?: Date;
}): Promise<IPosition[]> {
    const response = await api.get(
        `/api/positions/?companyId=${params.companyId}&relations=${!!params.relations}` +
            (params?.onDate ? `&onDate=${params?.onDate}` : '') +
            (params?.onPayPeriodDate ? `&onPayPeriodDate=${params?.onPayPeriodDate}` : ''),
        {
            headers: authHeader(),
        },
    );
    return response.data;
}

export async function getVacanciesList(params: {
    companyId: number;
    relations?: boolean;
    onDate?: Date;
    onPayPeriodDate?: Date;
}): Promise<IPosition[]> {
    const response = await api.get(
        `/api/positions/?vacanciesOnly=true&companyId=${params.companyId}&relations=${!!params.relations}` +
            (params?.onDate ? `&onDate=${params?.onDate}` : '') +
            (params?.onPayPeriodDate ? `&onPayPeriodDate=${params?.onPayPeriodDate}` : ''),
        {
            headers: authHeader(),
        },
    );
    return response.data;
}

export async function getPosition(params: {
    id: number;
    relations?: boolean;
    onDate?: Date;
    onPayPeriodDate?: Date | null | undefined;
}): Promise<IPosition> {
    const response = await api.get(
        `/api/positions/${params.id}?relations=${!!params.relations}` +
            (params.onDate ? `&onDate=${params.onDate}` : '') +
            (params.onPayPeriodDate ? `&onPayPeriodDate=${params.onPayPeriodDate}` : ''),
        {
            headers: authHeader(),
        },
    );
    return response.data;
}

export async function updatePosition(id: number, position: IUpdatePosition): Promise<IPosition> {
    const response = await api.patch(`/api/positions/${id}`, position, {
        headers: authHeader(),
    });
    return response.data;
}

export async function deletePosition(id: number): Promise<IPosition> {
    const response = await api.delete(`/api/positions/${id}`, { headers: authHeader() });
    return response.data;
}
