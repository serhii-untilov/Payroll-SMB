import {
    ICreatePosition,
    IFindPosition,
    IFindPositionBalance,
    IPosition,
    IPositionBalanceExtended,
    IUpdatePosition,
} from '@repo/shared';
import { axiosInstance } from '@/api';
import authHeader from './auth-header';

export async function createPosition(position: ICreatePosition): Promise<IPosition> {
    const response = await axiosInstance.post(`/api/positions/`, position, {
        headers: authHeader(),
    });
    return response.data;
}

export async function getPositions(params: IFindPosition): Promise<IPosition[]> {
    const response = await axiosInstance.post('/api/positions/find', params, {
        headers: authHeader(),
    });
    return response.data;
}

export async function getPositionsBalance(
    params: IFindPositionBalance,
): Promise<IPositionBalanceExtended[]> {
    const response = await axiosInstance.post('/api/positions/balance', params, {
        headers: authHeader(),
    });
    return response.data;
}

export async function getPosition(params: {
    id: number;
    relations?: boolean;
    onDate?: Date;
    onPayPeriodDate?: Date | null | undefined;
}): Promise<IPosition> {
    const response = await axiosInstance.get(
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
    const response = await axiosInstance.patch(`/api/positions/${id}`, position, {
        headers: authHeader(),
    });
    return response.data;
}

export async function deletePosition(id: number): Promise<IPosition> {
    const response = await axiosInstance.delete(`/api/positions/${id}`, { headers: authHeader() });
    return response.data;
}

export async function getPositionByPersonId(params: {
    personId: number;
    companyId: number;
    relations?: boolean;
    onDate?: Date;
    onPayPeriodDate?: Date | null | undefined;
}): Promise<IPosition> {
    const response = await axiosInstance.post(
        `/api/positions/person/${params.personId}?relations=${!!params.relations}` +
            (params.onDate ? `&onDate=${params.onDate}` : '') +
            (params.onPayPeriodDate ? `&onPayPeriodDate=${params.onPayPeriodDate}` : ''),
        { companyId: params.companyId },
        {
            headers: authHeader(),
        },
    );
    return response.data;
}
