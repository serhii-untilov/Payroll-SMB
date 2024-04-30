import { ICreatePositionHistory, IPositionHistory, IUpdatePositionHistory } from '@repo/shared';
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

export type GetListParams = {
    positionId: number;
    relations?: boolean;
    onDate?: Date;
};

export async function getPositionHistoryList({
    positionId,
    relations,
    onDate,
}: GetListParams): Promise<IPositionHistory[]> {
    const response = await api.get(
        `/api/position-history/?position=${positionId}&relations=${!!relations}` + onDate
            ? `&onDate=${onDate}`
            : '',
        {
            headers: authHeader(),
        },
    );
    return response.data;
}

export async function getPositionHistoryOnDate(
    params: GetListParams,
): Promise<IPositionHistory | null> {
    const list = await getPositionHistoryList(params);
    return list.length ? list[0] : null;
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
