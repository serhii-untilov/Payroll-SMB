import {
    CreatePaymentPositionDto,
    FindAllPaymentPositionDto,
    FindOnePaymentPositionDto,
    UpdatePaymentPositionDto,
} from '@repo/openapi';
import { api } from '@/api';

export async function paymentPositionsCreate(payload: CreatePaymentPositionDto) {
    return (await api.paymentPositionsCreate(payload)).data;
}

export async function paymentPositionsFindAll(params: FindAllPaymentPositionDto) {
    return (await api.paymentPositionsFindAll(params)).data;
}

export async function paymentPositionsFindOne(id: number, params: FindOnePaymentPositionDto) {
    return (await api.paymentPositionsFindOne(id, params)).data;
}

export async function paymentPositionsUpdate(id: number, payload: UpdatePaymentPositionDto) {
    return (await api.paymentPositionsUpdate(id, payload)).data;
}

export async function deletePaymentPosition(id: number) {
    return (await api.paymentPositionsRemove(id)).data;
}
