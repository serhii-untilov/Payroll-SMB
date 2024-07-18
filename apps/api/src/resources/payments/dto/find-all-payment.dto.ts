import { PaymentStatus } from '@/types';

export class FindAllPaymentDto {
    companyId: number;
    positionId?: number;
    payPeriod?: Date;
    accPeriod?: Date;
    paymentTypeId?: number;
    status?: PaymentStatus;
    relations?: boolean;
}
