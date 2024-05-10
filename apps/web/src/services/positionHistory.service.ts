import {
    ICreatePositionHistory,
    IFindPositionHistory,
    IPositionHistory,
    IUpdatePositionHistory,
} from '@repo/shared';
import { api } from '../api';
import authHeader from './auth-header';

export async function createPositionHistory(
    params: ICreatePositionHistory,
): Promise<IPositionHistory> {
    const response = await api.post(`/api/position-history/`, params, {
        headers: authHeader(),
    });
    return response.data;
}

export async function getPositionHistoryList(
    positionId: number,
    relations: boolean,
): Promise<IPositionHistory[]> {
    const response = await api.get(
        `/api/position-history/?positionId=${positionId}&relations=${!!relations}`,
        { headers: authHeader() },
    );
    return response.data;
}

export async function getPositionHistory(
    id: number,
    relations: boolean = false,
): Promise<IPositionHistory> {
    const response = await api.get(`/api/position-history/${id}?relations=${relations}`, {
        headers: authHeader(),
    });
    return response.data;
}

export async function updatePositionHistory(
    id: number,
    positionHistory: IUpdatePositionHistory,
): Promise<IPositionHistory> {
    const response = await api.patch(`/api/position-history/${id}`, positionHistory, {
        headers: authHeader(),
    });
    return response.data;
}

export async function deletePositionHistory(id: number): Promise<IPositionHistory> {
    const response = await api.delete(`/api/position-history/${id}`, { headers: authHeader() });
    return response.data;
}

export async function findLastPositionHistoryOnPayPeriodDate(
    positionId: number,
    date: Date,
    relations: boolean,
): Promise<IPositionHistory | null> {
    const params: IFindPositionHistory = { positionId, onPayPeriodDate: date, relations };
    const response = await api.post(`/api/position-history/find-last`, params, {
        headers: authHeader(),
    });
    return response.data;
}
