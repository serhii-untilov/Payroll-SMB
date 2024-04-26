import { ICreatePaymentType } from '@repo/shared';
export class CreatePaymentTypeDto implements ICreatePaymentType {
    name: string;
    paymentPart: string;
    paymentGroup: string;
    paymentMethod: string;
    description: string;
}
