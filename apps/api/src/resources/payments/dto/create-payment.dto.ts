export class CreatePaymentDto {
    companyId: number;
    payPeriod: Date;
    accPeriod: Date;
    docNumber?: string;
    docDate?: Date;
    paymentTypeId: number;
    dateFrom?: Date; // Between accPeriod.dateFrom and accPeriod.dateTo
    dateTo?: Date; // Between accPeriod.dateFrom and accPeriod.dateTo
    baseSum?: number;
    deductions?: number;
    paySum?: number;
    funds?: number;
    status?: string; // See enum PaymentStatus
    recordFlags?: number; // See enum RecordFlags
    description?: string;
}
