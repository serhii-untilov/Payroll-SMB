import { ICreatePaymentType } from '@repo/shared';
export class CreatePaymentTypeDto implements ICreatePaymentType {
    id: number;
    name: string;
    paymentGroup: string;
    paymentMethod: string;
}
