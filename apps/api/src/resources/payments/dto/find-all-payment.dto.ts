import { PaymentStatus } from '@/types';

export class FindAllPaymentDto {
    companyId: string;
    positionId?: string;
    payPeriod?: Date;
    accPeriod?: Date;
    paymentTypeId?: string;
    status?: PaymentStatus;
    relations?: boolean;
    withDeleted?: boolean;
}
