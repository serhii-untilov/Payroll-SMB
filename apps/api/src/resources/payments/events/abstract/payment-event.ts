import { Payment } from '../../entities/payment.entity';

export enum PaymentEventType {
    CREATED = 'created',
    UPDATED = 'updated',
    DELETED = 'deleted',
}

export abstract class PaymentEvent {
    private _type: PaymentEventType;
    private _userId: string;
    private _companyId: string;

    public get type() {
        return this._type;
    }
    public get userId() {
        return this._userId;
    }
    public get companyId() {
        return this._companyId;
    }

    constructor(type: PaymentEventType, userId: string, payment: Payment) {
        this._type = type;
        this._userId = userId;
        this._companyId = payment.companyId;
    }
}
