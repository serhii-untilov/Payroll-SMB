import { api } from '@/api';
import {
    CreatePositionDto,
    FindAllPositionBalanceDto,
    FindAllPositionDto,
    FindOnePositionDto,
    FindPositionByPersonDto,
    UpdatePositionDto,
} from '@repo/openapi';
import { MAX_SEQUENCE_NUMBER } from '@repo/shared';

export async function positionsCreate(payload: CreatePositionDto) {
    return (await api.positionsCreate(payload)).data;
}

export async function positionsFindAll(params: FindAllPositionDto) {
    const response = (await api.positionsFindAll(params)).data;
    return response.sort(
        (a, b) =>
            (Number(a.cardNumber) || MAX_SEQUENCE_NUMBER) -
            (Number(b.cardNumber) || MAX_SEQUENCE_NUMBER),
    );
}

export async function positionsFindBalance(params: FindAllPositionBalanceDto) {
    const response = (await api.positionsFindBalance(params)).data;
    return response.sort(
        (a, b) =>
            (Number(a.cardNumber) || MAX_SEQUENCE_NUMBER) -
            (Number(b.cardNumber) || MAX_SEQUENCE_NUMBER),
    );
}

export async function positionsFindOne(id: number, params?: FindOnePositionDto) {
    return (await api.positionsFindOne(id, params ?? {})).data;
}

export async function positionsUpdate(id: number, payload: UpdatePositionDto) {
    return (await api.positionsUpdate(id, payload)).data;
}

export async function positionsRemove(id: number) {
    return (await api.positionsRemove(id)).data;
}

export async function positionsFindFirstByPersonId(params: FindPositionByPersonDto) {
    return (await api.positionsFindFirstByPersonId(params)).data;
}
