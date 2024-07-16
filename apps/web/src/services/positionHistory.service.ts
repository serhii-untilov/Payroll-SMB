import { api } from '@/api';
import {
    CreatePositionHistoryDto,
    FindAllPositionHistoryDto,
    FindOnePositionHistoryDto,
    UpdatePositionHistoryDto,
} from '@repo/openapi';

export async function positionHistoryCreate(params: CreatePositionHistoryDto) {
    return (await api.positionHistoryCreate(params)).data;
}

export async function positionHistoryFindAll(params: FindAllPositionHistoryDto) {
    const response = (await api.positionHistoryFindAll(params)).data;
    return response.sort((a, b) => a.dateFrom.getTime() - b.dateFrom.getTime());
}

export async function positionHistoryFindOne(id: number, params: FindOnePositionHistoryDto) {
    return (await api.positionHistoryFindOne(id, params)).data;
}

export async function positionHistoryUpdate(id: number, payload: UpdatePositionHistoryDto) {
    return (await api.positionHistoryUpdate(id, payload)).data;
}

export async function positionHistoryRemove(id: number) {
    return (await api.positionHistoryRemove(id)).data;
}

export async function positionHistoryFindLast(params: FindAllPositionHistoryDto) {
    return (await api.positionHistoryFindLast(params)).data;
}
