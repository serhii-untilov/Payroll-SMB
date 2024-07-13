export class FindPaymentDto {
    companyId: number;
    positionId?: number;
    payPeriod?: Date;
    accPeriod?: Date;
    paymentTypeId?: number;
    status?: string;
    relations?: boolean;
}
